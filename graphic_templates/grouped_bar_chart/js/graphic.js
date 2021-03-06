// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function () {
    if (Modernizr.svg) {
        formatData();

        pymChild = new pym.Child({
            renderCallback: render,
        });
    } else {
        pymChild = new pym.Child({});
    }
};

/*
 * Format graphic data for processing by D3.
 */
var formatData = function () {
    DATA = DATA.map(function (d) {
        return {
            key: d.Group,
            values: d3.entries(d).reduce(function (memo, val) {
                if (val.key !== 'Group') {
                    memo.push({
                        label: val.key,
                        amt: +val.value,
                    });
                }

                return memo;
            }, []),
        };
    });
};

/*
 * Render the graphic(s). Called by pym with the container width.
 */
var render = function (containerWidth) {
    containerWidth = containerWidth || DEFAULT_WIDTH;
    isMobile = (containerWidth <= MOBILE_THRESHOLD);

    // Render the chart!
    renderGroupedBarChart();

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
};

/*
 * Render a bar chart.
 */
var renderGroupedBarChart = function () {
    /*
     * Setup chart container.
     */
    var numGroups = DATA.length;
    var numGroupBars = DATA[0].values.length;

    var barHeight = parseInt(LABELS.barHeight || (numGroupBars > 2 ? 10 : 30), 10);
    var barGap = parseInt(LABELS.barGap || 10, 10);
    var labelWidth = parseInt(LABELS.labelWidth || 85, 10);
    var labelMargin = parseInt(LABELS.labelMargin || 6, 10);
    var valueGap = parseInt(LABELS.valueGap || 6, 10);
    var groupHeight = (barHeight + barGap) * numGroupBars;
    var labelLineHeight = barHeight >= 20 ? 14 : barHeight;

    var margins = {
        top: parseInt(LABELS.marginTop || 0, 10),
        right: parseInt(LABELS.marginRight || 30, 10),
        bottom: parseInt(LABELS.marginBottom || 0, 10),
        left: parseInt(LABELS.marginLeft || (labelWidth + labelMargin), 10),
    };

    // Clear existing graphic (for redraw)
    var containerElement = d3.select('#grouped-bar-chart');
    containerElement.html('');

    /*
     * Create D3 scale objects.
     */
    var minX;
    if (LABELS.minX) {
        minX = parseFloat(LABELS.minX, 10);
    } else {
        minX = d3.min(DATA, function (d) {
            return d3.min(d.values, function (v) {
                return v.amt;
            });
        });

        if (minX > 0) {
            minX = 0;
        }
    }

    var maxX;
    if (LABELS.maxX) {
        maxX = parseFloat(LABELS.maxX, 10);
    } else {
        maxX = d3.max(DATA, function (d) {
            return d3.max(d.values, function (v) {
                return v.amt;
            });
        });
    }

    /*
     * Create the root SVG element.
     */
    var chartWrapper = containerElement.append('div')
            .attr('class', 'graphic-wrapper');

    // Calculate actual chart dimensions
    var innerWidth = chartWrapper.node().getBoundingClientRect().width;
    var chartWidth = innerWidth - margins.left - margins.right;

    var xScale = d3.scale.linear()
        .domain([minX, maxX])
        .range([0, chartWidth]);

    var colorScaleDomain = DATA[0].values.map(function (d) { return d.label; });

    var colorList = colorArray(LABELS, MONOCHROMECOLORS);
    var colorScale = d3.scale.ordinal()
        .domain(colorScaleDomain)
        .range(colorList);

    var accessibleColorScale = d3.scale.ordinal()
        .domain(colorScaleDomain)
        .range(colorList.map(function (color) {
            return getAccessibleColor(color);
        }));

    DATA.forEach(function (dat, ind) {

        var groupLabels = chartWrapper.append('div')
            .attr('class', 'group-label')
            .style('margin-left', margins.left + 'px')
            .text(dat.key);

        var labelData = [];
        dat.values.forEach(function (e) {
            labelData.push(e.label);
        });

        /*
         * Render bar labels.
         */
        chartWrapper.append('ul')
            .attr('class', 'labels')
            .style({
                width: labelWidth + 'px',
                top: margins.top + 'px',
                left: 0,
            })
            .selectAll('li')
            .data(labelData)
            .enter()
            .append('li')
                .attr('class', function (d, i) {
                    return classify(d);//.key);
                })
                .style({
                    'line-height': labelLineHeight + 'px',
                    width: labelWidth + 'px',
                    height: barHeight + 'px',
                    left: 0,
                    top: function (d, i) {
                        var barIndex = i % numGroupBars;
                        var barOffset = (barHeight + barGap) * barIndex;
                        var top = barOffset;
                        return top + 'px';
                    },
                })
                .append('span')
                    .text(function (d) {
                        return d;//.key
                    });

        var chartElement = chartWrapper.append('svg')
            .attr({
                width: chartWidth + margins.left + margins.right,
                height: groupHeight + margins.top + margins.bottom,
            })
            .append('g')
                .attr('transform', makeTranslate(margins.left, margins.top));

        /*
         * Render bars to chart.
         */
        var bars = chartElement.selectAll('rect')
            .data(dat.values)
            .enter()
            .append('rect')
                .attr({
                    x: function (d) {
                        if (d.amt >= 0) {
                            return xScale(0);
                        }

                        return xScale(d.amt);
                    },

                    y: function (d, i) {
                        return (barHeight + barGap) * i;
                    },

                    width: function (d) {
                        return Math.abs(xScale(0) - xScale(d.amt));
                    },

                    height: barHeight,

                    fill: function (d) {
                        return colorScale(d.label);
                    },
                })
                .attr('class', function (d) {
                    return 'y-' + classify(d.label);
                });

        /*
         * Render bar values.
         */
        var values = chartElement.append('g')
            .attr('class', 'value')
            .selectAll('text')
            .data(dat.values)
            .enter()
            .append('text')
                .text(function (d) {
                    return formattedNumber(
                        d.amt,
                        LABELS.valuePrefix,
                        LABELS.valueSuffix,
                        LABELS.maxDecimalPlaces
                    );
                })
                .attr({
                    x: function (d) {
                        if (d.amt < 0) {
                            return xScale(0);
                        }

                        return xScale(d.amt);
                    },

                    y: function (d, i) {
                        return (barHeight + barGap) * i;
                    },

                    dx: valueGap,

                    dy: (barHeight / 2),

                    fill: function (d) {
                        return accessibleColorScale(d.label);
                    },

                });

        if (LABELS.theme == 'highlight') {
            var highlightBarIndex;

            var clearHighlight = function () {
                bars.attr('fill', function (d, i) {
                        return colorScale(i);
                    });

                values.classed('over', false);
            };

            chartElement.on({
                mousemove: function (e) {
                    var posY = d3.mouse(chartElement.node())[1];
                    var barIndex = Math.floor(posY / (barHeight + barGap));
                    if (highlightBarIndex === barIndex) {
                        return; // still over the same element
                    }

                    highlightBarIndex = barIndex;
                    clearHighlight();
                    bars.filter(':nth-child(' + (barIndex + 1) + ')')
                        .attr('fill', HIGHLIGHTCOLORS.active);
                    values.filter(':nth-child(' + (barIndex + 1) + ')')
                        .classed('over', true);
                },

                mouseout: function (e) {
                    highlightBarIndex = -1;
                    clearHighlight();
                },
            });
        }

    });

};

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
