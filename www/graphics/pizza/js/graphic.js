    var colors = {
        'red1': '#6C2315', 'red2': '#A23520', 'red3': '#D8472B', 'red4': '#E27560', 'red5': '#ECA395', 'red6': '#F5D1CA',
        'orange1': '#714616', 'orange2': '#AA6A21', 'orange3': '#E38D2C', 'orange4': '#EAAA61', 'orange5': '#F1C696', 'orange6': '#F8E2CA',
        'yellow1': '#77631B', 'yellow2': '#B39429', 'yellow3': '#EFC637', 'yellow4': '#F3D469', 'yellow5': '#F7E39B', 'yellow6': '#FBF1CD',
        'teal1': '#0B403F', 'teal2': '#11605E', 'teal3': '#17807E', 'teal4': '#51A09E', 'teal5': '#8BC0BF', 'teal6': '#C5DFDF',
        'blue1': '#28556F', 'blue2': '#3D7FA6', 'blue3': '#51AADE', 'blue4': '#7DBFE6', 'blue5': '#A8D5EF', 'blue6': '#D3EAF7'
    };


/*
     * NB: Use window.load instead of document.ready
     * to ensure all images have loaded
     

     */
    $(window).load(function() {
    	var $graphic = $('#graphic');
        var graphic_data_url = 'pizza_m.csv';
        var graphic_data_url4 = 'fittedvals_all.csv';
    	var graphic_data;
        var graphic_data4;

    function drawGraphic(width) {

// console.log("graphic_data4")
// console.log(graphic_data4)
    // function to move stuff to front
          d3.selection.prototype.moveToFront = function() {
              return this.each(function(){
                this.parentNode.appendChild(this);
              });
            };

            var margin = {top: 100, right: 20, bottom: 40, left: 100};
            var margin2 = {top: 100, right: 20, bottom: 40, left: 10};
            var width = width - margin.left ;
            var height = 1000 - margin.top - margin.bottom;
        
            var num_x_ticks = 30;
            if (width <= 480) {
                num_x_ticks = 10;
            }

            // clear out existing graphics
            $graphic.empty();


            var width1 = 7*width/8
            var height1 = height/3

            var width2 = width
            var height2 = height/7

            var xVal = function(d) { return d.size;};
            var x = d3.scale.linear().range([0, width1])
            		.domain([8, 30])
                    .clamp(true);

    		var xMap = function(d) { return x(xVal(d));}; 

    		var yVal = function(d) { return d.px_inc;};
            var y = d3.scale.linear().range([height1, 0])
            		.domain([0,.4]);
    	    var yMap = function(d) { return y(yVal(d));}; // data -> display


    	    var svg = d3.select("#graphic")
                    .append("svg")
                    .attr("class", "svg1")
                        .attr("width", width1 + margin.left+ margin.right )
                        .attr("height", height1 + margin.top)
                    .append("g")
                        .attr("transform", "translate(" + margin.left + ",40)");

            var svg2 = d3.select("#graphic")
                        .append("svg")
                        .attr("class", "svg2")
                            .attr("width", width2 )
                        .attr("height", height2 + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(20, 30)");


            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickSize(10)
                .ticks(30);


            var x_axis_grid = function() { return xAxis; }

            var yAxis = d3.svg.axis()
                .orient("left")
                .scale(y)
                .tickPadding(14)
                .tickSize(0)
                .ticks(10);

            var y_axis_grid = function() { return yAxis; }

            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x(d.size); })
                .y(function(d) { return y(d.fitted); });

    // make pizza
            var color = d3.scale.category10();
            var pie = d3.layout.pie();


            var brush = d3.svg.brush()
                .x(x)
                .extent([14, 14])
                .on("brush", brushed);
                
            svg.append("g")
                .attr("class", "x axis brush")
                .attr("transform", "translate(0," + height1 + ")")
                .call(d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .ticks(num_x_ticks)
                  .tickSize(10)
                  .tickPadding(12))
              .select(".domain")
              .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "halo");

            var slider = svg.append("g")
                .attr("class", "slider")
                .call(brush);

            slider.selectAll(".extent,.resize")
                .remove();

            slider.select(".background")
                .attr("height", height1);


    //////////////////////////////////1////////////////////////////////
    // init for labels
    //////////////////////////////////////////////////////////////////
            var equal1x = width1*(1/30);
            var equal1y = height1*(9/30);
            var equal2x = width1*(1/30);
            var equal2y = height1*(21/30);
            var label2x = width1*(5/30);
            var label2y = height2*(19/30);
            var scalef = width/200;
            var pizzax = 5*width/30;
            var pizza = svg2.append("circle")
                        .attr("class", "pizza")
                        .attr("r", 20);

            var bigprice = svg2.append("text")
                        .attr("class", "prices")
                        .attr("x", bigpricex)
                        .attr("y", bigpricey);   

            var psize = 6;
            var pprice = 0;
            var psizearea = 0;

    //////////////////////////////////1////////////////////////////////
    // code for slider
    //////////////////////////////////////////////////////////////////


            var handle2 = slider.append("rect") 
              .attr("class", "handle")
              .attr("height", height1)
              .attr("width", width/200)
              .attr("transform", "translate(" +width*(0/600) + ",0)")
              .style("opacity", .5);
            
            var handle_label = slider.append("text") 
              .attr("class", "handle_label")
              .attr("y", y(0)+8)
              .text(" ")
              .style("opacity", 1)
              .attr("font-size", "24px");

  // d3.selectAll("#infoBox").append("svg:image")
  //     .attr("xlink:href", "http://www.e-pint.com/epint.jpg")
  //     .attr("width", 150)
  //     .attr("height", 200);

            var handle = slider.append("svg:image")
                .attr("transform", "translate(0," + height1-200 + ")")
                .attr("class", "handle_tooltip")
                .attr("xlink:href", "../pizza/img/slider.png")
                .attr("width", 150)
                .attr("height", 20)
                .style("opacity",.7);



                // .attr("r", width/50)
                // .style("opacity", .5);


var bigpricex = width1*(3/30);
var bigpricey = height2*(9/30);

            var bigprice = svg2.append("text")
                        .attr("class", "bigprices")
                        .attr("x", bigpricex)
                        .attr("y", bigpricey);
var midpricex = width1*(16/30);
var midpricey = height2*(9/30);

            var midprice = svg2.append("text")
                        .attr("class", "midprices")
                        .attr("x", midpricex)
                        .attr("y", midpricey);
var smallpricex = width1*(26/30);
var smallpricey = height2*(9/30);

            var smallprice = svg2.append("text")
                        .attr("class", "smallprices")
                        .attr("x", smallpricex)
                        .attr("y", smallpricey);
var sizex = width1*(0/30);
var sizey = height2*(18/30);

            var size = svg2.append("text")
                        .attr("class", "size")
                        .attr("x", sizex)
                        .attr("y", sizey)
                        .text("Size:")
                        .attr("fill", "#464738")
                        .style('font-size',"36px");

var pricelabelx = width1*(0/30);
var pricelabely = height2*(38/30);

            var pricelabel = svg2.append("text")
                        .attr("class", "prices")
                        .attr("x", pricelabelx)
                        .attr("y", pricelabely)
                        .text("Price:")
                        .attr("fill", "#17807E")
                        .style('font-size',"40px");                        ;   

// var crustname = svg.append("text")
//             .attr("class", "crustname")
//             .attr("x", x(18.5))
//             .attr("y", y(.41))
//             .text("All Pizzas")
//             .attr("fill", "#3270cc")
//             .style("font-size", "25px")
//             .style("font-weight", "bold")
//             .style("opacity",.3);

// var annot1 = svg.append("text")
//             .attr("class", "annote")
//             .attr("x", x(12))
//             .attr("y", y(.41))
//             .html("Price of Pizza Falls Exponentially")
//             .attr("fill", "#ccc")
//             .style("font-size", "14px");
// var annot1 = svg.append("text")
//             .attr("class", "annote")
//             .attr("x", x(14.3))
//             .attr("y", y(.39))
//             .text("Across All Styles Of Pizza")
//             .attr("fill", "#ccc")
//             .style("font-size", "14px");

var labelbigx = width1*(5/30);
var labelbigy = height2*(18/30);
            var bigpizza = svg2.append("text")
                        .attr("class", "equallabbig")
                        .attr("x", labelbigx)
                        .attr("y", labelbigy)
                        .attr("fill", "#464738");

            var midpizza = svg2.append("text")
                        .attr("class", "pizzalabels")
                        .attr("x", label2x)
                        .attr("y", label2y);

            var smallpizza = svg2.append("text")
                        .attr("class", "pizzalabels")
                        .attr("x", label3x)
                        .attr("y", label3y)
                        .moveToFront();

            // var equal1 = svg.append("text")
            //             .attr("class", "equallab")
            //             .attr("x", x(19.5))
            //             .attr("y", y(.33))
            //             .text("...has the same area ")
            //             .attr("fill", "#70725A");

var label3x = width1*(1/30);
var label3y = height2*(50/30);
//             var equal4 = svg2.append("text")
//                         .attr("class", "equallab")
//                         .attr("x", label3x)
//                         .attr("y", label3y)
//                         .html("Buying TK inch pizza is going to equivalent to buying TK 14 inch pizzas and TK 8 inch pizzas")
//                         .attr("fill", "#70725A")
//                         .style("font-size", "21px");


// var label3x = width1*(1/30);
// var label3y = height2*(60/30);
//             var equal4 = svg2.append("text")
//                         .attr("class", "equallab")
//                         .attr("x", label3x)
//                         .attr("y", label3y)
//                         .html("Which would cost you TK or TK dollars ")
//                         .attr("fill", "#70725A")
//                         .style("font-size", "21px");

var label5x = width1*(21/30);
var label5y = height2*(18/30);
            var equal5 = svg2.append("text")
                        .attr("class", "equallab14")
                        .attr("x", label5x)
                        .attr("y", label5y)
                        .text(" 14\"")
                        .attr("fill", "#464738")
                        .style("font-size", "24px");

var label6x = width1*(31/30);
var label6y = height2*(18/30);
            

            var equal6 = svg2.append("text")
                        .attr("class", "equallab8")
                        .attr("x", label6x)
                        .attr("y", label6y)
                        .text(" 8\"")
                        .attr("fill", "#464738")
                        // .style("font-size", fontsize8)
                        .moveToFront();


            var xaxislabel = svg.append("text") 
                          .attr("class", "xaxis_label")
                          .attr("y", y(0)+60)
                          .attr("x", width1*(3/8))
                          .text("Pizza Size (Diameter In Inches)")
                          .style("opacity", 1)
                          .style("fill", "#464738")
                          .attr("font-size", "16px");  


            var yaxislabel = svg.append("text") 
                          .attr("class", "yaxis_label")
                          .attr("y", y(.4)-55)
                          .attr("x", -height1*(3.1/4))
                          .attr("transform", "rotate(-90)")
                          .text("Price Per Square Inch ($)")
                          .style("opacity", 1)
                          .style("fill", "#464738")
                          .attr("font-size", "16px");

            var psize2 = "all";

            slider
                .call(brush.event)
              // .transition() 
              //   .duration(1000)
              //   .call(brush.extent([18, 18]))
              //   .call(brush.event);

            function brushed() {
              
             // var value = brush.extent(),
             //      extent1;

             //  // if dragging, preserve the width of the extent
             //  if (d3.event.mode === "move") {
             //    var d0 = d3.round(extent0[0],1),
             //        d1 = d3.offset(d0, Math.round((extent0[1] - extent0[0]) / 864e5));
             //    extent1 = [d0, d1];
             //  }



            var value = brush.extent()[0];
       

              if (d3.event.sourceEvent) { // not a programmatic event
                value = Math.round(x.invert(d3.mouse(this)[0]));

                brush.extent([value, value]);
              }


              var toolPosition = x(value)-75;

              handle
                .attr("transform", "translate(" + toolPosition + "," + height1 + ")");
              
              handle2.attr("x", x(value)-4);
              handle_label.attr("x", x(value)-18);

              svg2.selectAll(".pizza")
                    .attr("r", pies(value)); // attribute = radius
                    // .attr("r", value);

              var sqinch = [];  
              // $(".arcpie").remove();
              $(".arcpie").remove();
              $(".arcpie2").remove();
              $(".pies").remove();
              arc(value,psize2); 

              // console.log(value);
            }



    //////////////////////////////////////////////////////////////////
    function bigpizzacall(value1,value2,value3) {
            d3.selectAll('#bigamount').html("One " + value1 + "\" pizza has roughly the same area as <em>" + value2 + "</em> 16\" pizzas or <em>" + value3 + "</em> 8\" pizzas.");        
        bigpizza
            .text(value1 + "\"")
            // .text("This " + value + "    inch pizza..." )
            .attr("font-family", "sans-serif");

    }
    function bigpriceall_annote(value1,value2) {
        midpizza          
            .text(value ) //+ " -- 16 Inch Pizzas")
            .attr("font-family", "sans-serif")
            .attr("font-size", "24px")
            .moveToFront();
        }

         // function midpizzacall(value1,value2) {
    //         d3.selectAll('#midamount').text("Is roughly the same area as " + value1 + " 16\" pizzas or " + value2 + " 8\" pizzas.");        
        // midpizza          
        //     .text(value ) //+ " -- 16 Inch Pizzas")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "24px")
        //     .attr("fill", "#000")
        //     .style("opacity",.6)
        //     .moveToFront();
        //}
    // function smallpizzacall(value) {
    //         d3.selectAll('#smallamount').text("Or " + value + " 8\" pizzas.");              
        // smallpizza          
        //     .text(value) //+ " -- 8 Inch Pizzas")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "24px")
        //     .attr("fill", "#000")
        //     .style("opacity",.6)
        //     .moveToFront();
// 
        // }
    function bigpricecall(value1,value2,value3,largestpizza) {
        var medSavings = d3.round((value2-value1),2)
        var smallSavings = d3.round((value3-value1),2)
        
        if (medSavings <= 0)
            {
                d3.selectAll('#bigprice').html("Buying the " + largestpizza + "\" pizza saves you <em>$" + smallSavings + "</em> over the equivalent number of the 8\" pizzas.");        
            } else 
            {
                d3.selectAll('#bigprice').html("Buying the " + largestpizza + "\" pizza saves you <em>$" + smallSavings + "</em> over the equivalent number of the 8\" pizzas, and <em>$" + medSavings + "</em> over the equivalent number of 14\" pizzas.");        
            }

        bigprice          
            .text("$" + value1.toFixed(2) )
            .attr("font-family", "sans-serif")
            .attr("fill", "#17807E")        
            .attr("font-weight", "bold");        
        }

    function midpricecall(value) {
        midprice          
            .text("$" + value.toFixed(2) )
            .attr("font-family", "sans-serif")
            .attr("fill", "#17807E")
            .attr("font-weight", "bold");        
        
        }
    function smallpricecall(value) {
        smallprice
            .text("$" + value.toFixed(2))
            .attr("font-family", "sans-serif")
            .attr("fill", "#17807E")
            .attr("font-weight", "bold");        
        
        }

    function pies(d) { 
        // make multiple pies
        var diam_base_px_for_big_circle = scalef*d/2; // base diameter of pizza express in pixels for graphic
        var diam_val = d3.round(diam_base_px_for_big_circle); // base diameter of pizza express in pixels for graphic

        labelvarpizza_act(diam_base_px_for_big_circle);
        return diam_base_px_for_big_circle;
        
                    }

    function labelvarpizza_act(d) {
        // var varpizzaprice = function(d) { return d["mean"]};
        var varpizzaprice = "gonna figure";
        // console.log(varpizzaprice)


    }


    function arc(diam,psize2) {

        var midpizzapx  = 14.50;
        var smallpizzapx  = 8.25;

         
                                 if (psize2 == "Deep Dish") {
                                     midpizzapx = 18.99;
                                     smallpizzapx  = 8.74;
                                 }
                                 if (psize2 == "Thin") {
                                     midpizzapx = 15.95;
                                     smallpizzapx  = 6.99;
                                 }
                                 if (psize2 == "Regular") {
                                     midpizzapx = 14.49;
                                     smallpizzapx  = 6.99;
                                 }
                                 if (psize2 == "Stuff Crust") {
                                     midpizzapx = 19.99;
                                     smallpizzapx  = 9.250;
                                 }
                                 if (psize2 == "All") {
                                     midpizzapx  = 15.99;
                                     smallpizzapx  = 6.99;
                                 }

                            
                            // console.log (midpizzapx);    // base case = 6 in pizza
                                // radius in graphic = 27 px == scale 3x
                                var diam_base = 8 // base diameter of pizza
                                var diam_base_px = scalef*diam_base/2// base diameter of pizza express in pixels for graphic
                                var diam_base2 = 14 // base diameter of pizza
                                var diam_base2_px = scalef*diam_base2/2// base diameter of pizza express in pixels for graphic
                                var sqinch_max = Math.pow((diam_base/2),2)*Math.PI;
                                var sqinch_max2 = Math.pow((diam_base2/2),2)*Math.PI;
                                var sqinch_val = Math.pow((diam/2),2)*Math.PI;
                                var sqinch_norm = 2*(sqinch_val/sqinch_max); // 2*number of 8" pizzas
                                var sqinch_norm2 = 2*(sqinch_val/sqinch_max2); // 2*number of 14" pizzas
                                
                                var bigpizza_diam = d3.round(diam,1)
                                var midpizza_diam = d3.round((sqinch_norm2/2),1)
                                var smallpizza_diam = d3.round((sqinch_norm/2),1)
                                


                                var bigprice_ave = d3.round(diam,1)
                                var midprice_ave = d3.round((sqinch_norm2*midpizzapx/2),2)
                                var smallprice_ave = d3.round((sqinch_norm*smallpizzapx/2),2)

                                var piedata = [1];
                                var piecount = Math.ceil(sqinch_val/sqinch_max);
                                var arc_array = [];
                                var width_pie = width/1.2;
                                var width_pieb = 50*width1/100 ;
                                var width_pieb2 = 80*width1/100 ;
                                var width_pieb3 = 18*width1/100 ;

                                var pizzay =  height*(5/100);
                                // var pizzay = 8.5*height2/10;
                                var pizza2y = height*(5/100);
                                var pizza3y = height*(2/100) + 2*diam;
                                

                                var unit = width1/50;
                                
                                if (width1 <400) {
                                    unit = 10;
                                }

                                d3.selectAll(".smallprices")
                                .attr("x", smallpricex);

                                var small_label = width_pieb2+unit*8.5;
                                var fontsize_1 = width1/25;
                                var fontsize = fontsize_1 + "px";
                                var fontsize_2 = width1/25;
                                var fontsize2 = fontsize_2 + "px";


                                d3.selectAll(".equallab8")
                                .attr("x", small_label)
                                .style("font-size", fontsize);
                                
                                var medium_label = width_pieb+unit*6.5;
                                
                                d3.selectAll(".equallab14")
                                .attr("x", medium_label)
                                .style("font-size", fontsize);

                                var small_labely = pizzay + unit*5.5;
                                
                                var big_label = width_pieb3+unit*(diam/5);
                                 d3.selectAll(".equallabbig")
                                .attr("x", big_label)
                                .style("font-size", fontsize);
                                
                                 d3.selectAll(".bigprices")
                                .attr("x", big_label)
                                .attr("y", small_labely)
                                .style("font-size", fontsize2);

                                 d3.selectAll(".midprices")
                                .attr("x", medium_label)
                                .attr("y", small_labely)
                                .style("font-size", fontsize2);

                                 d3.selectAll(".smallprices")
                                .attr("x", small_label)
                                .attr("y", small_labely)
                                .style("font-size", fontsize2);

                                d3.selectAll(".prices")
                                .attr("y", small_labely)
                                .style("font-size", fontsize)

                                d3.selectAll(".size")
                                // .attr("y", small_labely)                                
                                .style("font-size", fontsize);

                                for (var i =1; i<piecount; i++)
                                {
                                    var count = i;
                                    piedata.push(count);
                                }

                                ///////////////////////////
                                // 14 inch pizzas
                                ///////////////////////////

                                var arcb = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle(sqinch_norm2*Math.PI);
                                var arcb2 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm2-2)*Math.PI);
                                var arcb3 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm2-4)*Math.PI);
                                var arcb4 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm2-6)*Math.PI);
                                var arcb5 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm2-8)*Math.PI);
                                var arcb6 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base2_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm2-10)*Math.PI);


                                svg2.append("path")
                                .attr("class", "arcpie2")
                                .attr("d", arcb)
                                .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");

                                if (sqinch_norm2 > 2) {

                                    width_pieb = width_pieb + diam_base_px*3.5;    
                                    svg2.append("path")
                                    .attr("class", "arcpie2")
                                    .attr("d", arcb2)
                                    .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");
                                }

                                if (sqinch_norm2 > 4) {
                                    
                                    width_pieb = 50*width1/100 ;
                                    pizzay = pizzay + diam_base_px*3.5;        
                                    svg2.append("path")
                                    .attr("class", "arcpie2")
                                    .attr("d", arcb3)
                                .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");
                                }


                                if (sqinch_norm2 > 6) {
                                    width_pieb = width_pieb + diam_base_px*3.5;    
                                    svg2.append("path")
                                    .attr("class", "arcpie2")
                                    .attr("d", arcb4)
                                .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");
                                }

                                if (sqinch_norm2 > 8) {
                                    width_pieb = 50*width1/100 ;
                                    pizzay = pizzay + diam_base_px*3.5;        
                                    svg2.append("path")
                                    .attr("class", "arcpie2")
                                    .attr("d", arcb5)
                                .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");
                                }

                                if (sqinch_norm2 > 10) {
                                    width_pieb = 60*width1/100 ;
                                    width_pieb = width_pieb + diam_base_px*3.5;    
                                    svg2.append("path")
                                    .attr("class", "arcpie2")
                                    .attr("d", arcb6)
                                .attr("transform", "translate(" + width_pieb  +  "," + pizzay + ")");
                                }


                                ///////////////////////////
                                // 8 inch pizzas
                                ///////////////////////////
                                var arc = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle(sqinch_norm*Math.PI);
                                 var arc2 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-2)*Math.PI);
                                 var arc3 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-4)*Math.PI);
                                 var arc4 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-6)*Math.PI);
                                 var arc5 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-8)*Math.PI);
                                 var arc6 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-10)*Math.PI);
                                 var arc7 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-12)*Math.PI);
                                 var arc8 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-14)*Math.PI);
                                 var arc9 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-16)*Math.PI);
                                 var arc10 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-18)*Math.PI);
                                 var arc11 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-20)*Math.PI);
                                 var arc12 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-22)*Math.PI); 
                                var arc13 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-24)*Math.PI);
                                 var arc14 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-26)*Math.PI);
                                 var arc15 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-28)*Math.PI);
                                 var arc16 = d3.svg.arc()
                                .innerRadius(0)
                                .outerRadius(diam_base_px)
                                .startAngle(0)
                                .endAngle((sqinch_norm-30)*Math.PI);

                                pizza.attr("transform", "translate(" + width_pieb3  +  "," + pizza3y + ")");

                                svg2.append("path")
                                .attr("class", "arcpie")
                                .attr("d", arc)
                                .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");

                                if (sqinch_norm > 2) {

                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc2)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 4) {
                                    
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc3)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }


                                if (sqinch_norm > 6) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc4)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 8) {
                                    width_pieb2 = 80*width1/100 ;
                                    pizza2y = pizza2y + diam_base_px*2;
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc5)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");    }

                                if (sqinch_norm > 10) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc6)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 12) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc7)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 14) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc8)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 16) {
                                    width_pieb2 = 80*width1/100 ;
                                    pizza2y = pizza2y + diam_base_px*2
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc9)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 18) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc10)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 20) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc11)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 22) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc12)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 24) {
                                    width_pieb2 = 80*width1/100;
                                    pizza2y = pizza2y + diam_base_px*2
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc13)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 26) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc14)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");
                                }

                                if (sqinch_norm > 28) {
                                    width_pieb2 = width_pieb2 + diam_base_px*2;    
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc15)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");

                                }

                                if (sqinch_norm > 30) {
                                    width_pieb2 = width_pieb2 + 50;        
                                    svg2.append("path")
                                    .attr("class", "arcpie")
                                    .attr("d", arc16)
                                    .attr("transform", "translate(" + width_pieb2  +  "," + pizza2y + ")");

                                }

                                ////////////////////////////////////////////////////////
                                // text
                                ////////////////////////////////////////////////////////
                                bigpizzacall(bigpizza_diam,midpizza_diam, smallpizza_diam);  
                                // midpizzacall(midpizza_diam, smallpizza_diam); 
                                // smallpizzacall(sm allpizza_diam);
                                // Model 
                                // a = 1.546 b = -1.046 
                                var ppi = lookupfit(bigpizza_diam);
                                bigprice_ave = Math.pow((bigpizza_diam/2),2)*Math.PI*ppi

                                bigpricecall(bigprice_ave,midprice_ave,smallprice_ave,bigpizza_diam);
                                midpricecall(midprice_ave); 
                                smallpricecall(smallprice_ave); 

    }


    ////////////////////////////////////////////
    // scatter starts here
    ////////////////////////////////////////////

        svg.attr('class', 'scatter')
            .selectAll('circle')
                .data(graphic_data)
            .enter().append('circle')
                .attr('class', function(d) { return d.crust + "_circle"})               
                .attr("r", width/200)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "#17807E")
                .style("opacity", .1);


        svg.append("path")
            .datum(graphic_data4)
            .attr("class", "line_all")
            .attr("d", line);



        d3.select('.handle')
            .on("mouseover", mouseover);

        d3.select('.handle2')
            .on("mouseover", mouseover);

// console.log("graphic_data6");
// console.log(graphic_data6);
        
            svg.append("g") // Add the Y Axis
                .attr("class", "y axis")
                .call(yAxis);
        
            svg.append("g")         
                .attr("class", "y grid")
                .call(y_axis_grid()
                    .tickSize(-width1, 0, 0)
                    .tickFormat(" ")
                );

      

            // update responsive iframe
            sendHeightToParent();
        }

            function lookupfit(size){
            for (var i = 0; i < graphic_data4.length; i++) 
            {
                if (graphic_data4[i].size == size) {
                    return graphic_data4[i].fitted;
                }
            }
            
            return null;
            }
             


            function mouseover() {
                this.style("opacity",1);
            }

          

        function setup() {
            if (Modernizr.svg) {
                d3.csv(graphic_data_url, function(error, data) {
                    graphic_data = data;

                    graphic_data.forEach(function(d) {
                        d.size = +d.size;
                        d.value = +d.value;
                        d.px_inc = +d.px_inc;
                        d.crust = d.crust;

                    });



                });



                d3.csv(graphic_data_url4, function(error, data) {
                    graphic_data4 = data;

                    graphic_data4.forEach(function(d) {
                        d.size = +d.sizes;
                        d.fitted = +d.fitted;

                    });

               setupResponsiveChild({
                        renderCallback: drawGraphic 
                    });

                });




            }
        }

        setup();

    })