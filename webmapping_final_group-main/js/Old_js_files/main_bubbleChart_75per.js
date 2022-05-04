
//anonymous function to wrap script
(function(){   
        
    var attrArray = ["January, 2019","February, 2019","March, 2019","April, 2019","May, 2019","June, 2019","July, 2019","August, 2019","September, 2019","October, 2019","November, 2019","December, 2019","January, 2020","February, 2020","March, 2020","April, 2020","May, 2020","June, 2020","July, 2020","August, 2020","September, 2020","October, 2020","November, 2020","December, 2020","January, 2021","February, 2021","March, 2021","April, 2021","May, 2021","June, 2021","July, 2021","August, 2021","September, 2021","October, 2021","November, 2021","December, 2021","January, 2022","February, 2022"]
    var expressed = attrArray[0]; //initial attribute    

    //chart frame dimensions
    var chartWidth = window.innerWidth * 0.85,
        chartHeight = 800,
        leftPadding = 40,
        rightPadding = 2,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    var x = d3.scaleLinear()
        .range([60, chartInnerWidth-20])//output minimum and maximum - pixel values on the page/map
        .domain([0, 46]);

    var y = d3.scaleLinear()        
        .range([chartInnerHeight -10, 50])
        .domain([-15000, 15000]);    
        
    //begin script when window loads
    window.onload = setMap();

    //set up choropleth map
    function setMap(){         

        //use Promise.all to parallelize asynchronous data loading       
        var promises = [d3.csv("data/FINAL_net_gasImports_GDP2.csv")];                    
                    Promise.all(promises).then(callback);        

        //data parameter - retrieves data as an array
        function callback(data){ 
                    
            csvData = data[0];            

            //create the color scale
            var colorScale = makeColorScale(csvData);            

            //adding chart
            setChart(csvData, colorScale);

            //calling create dropdown
            createDropdown(csvData);

            //calling create legend function
            createLegend(csvData, expressed, colorScale);

            //createSizeLegend(csvData, expressed, colorScale)
            
        };
    };

        //function to create a DROPDOWN MENU for attribute selection
        function createDropdown(csvData){
            //add select element
            var dropdown = d3
                .select("body")
                .append("select")
                .attr("class", "bubble_dropdown")
                .on("change", function(){
                    changeAttribute(this.value, csvData)                    
                });

            //add initial option
            var titleOption = dropdown
                .append("option")
                .attr("class", "bubble_titleOption")
                .attr("disabled", "true")
                .text("Select Date");

            //add attribute name options
            var attrOptions = dropdown
                .selectAll("attrOptions")
                .data(attrArray)
                .enter()
                .append("option")
                .attr("value", function(d){ 
                    return d;
                })
                .text(function(d){ 
                    return d;
                });
        };

        //dropdown change event handler
        function changeAttribute(attribute, csvData) {
            //change the expressed attribute
            expressed = attribute;

            //recreate the color scale
            var colorScale = makeColorScale(csvData);
                    
            var circles = d3.selectAll(".circle")

            updateChart(circles, csvData.length, colorScale);                
        };

        //function to create coordinated bar chart - axis scale
        function setChart(csvData, colorScale){

            var chart = d3.select("body") //get the <body> HTML element from the DOM
                //method chaining
                .append("svg") //put a new svg in the body
                .attr("width", chartWidth)  //assign the width set to w
                .attr("height", chartHeight) //assign the height set to h                
                .attr("class", "bubble_chart") //always assign a class (as the block name) for styling and future selection                
                //.style("background-color", "rgba(0,109,44,0.2)"); //only put a semicolon at the end of the block!                            

            //appending innerRect block to the container variable
            var innerRect = chart.append("rect")
                .datum(400) //a single value is a DATUM - method applied to the variable
                .attr("width", chartInnerWidth - 60)
                .attr("height", chartInnerHeight - 60)                
                .attr("class", "bubble_innerRect") //class name
                .attr("x", 50) //position from left on the x (horizontal) axis
                .attr("y", 40) //position from top on the y (vertical) axis
                .style("fill", "rgb(150, 150, 150");        

            //appends a circle for every item in dataValues array
            var circles = chart.selectAll(".circle")                
                .data(csvData)
                .enter()
                .append("circle")
                .attr("class","circles")
                .attr("class", function(d){
                    return "circle " + d.country.replace("(", '').replace(')',"").replaceAll(/\s+/g, '');
                })                
               
            var yAxis = d3.axisLeft(y);//creating a y axis generator

            var axis = chart.append("g")//creating an axis g element and adding it to the axis
                .attr("class", "bubble_axis")
                .attr("transform", "translate(50, -10)")
                //basically translates the x,y coordinates of the axis
                .call(yAxis);
            
            //adding a title [class] to the chart
            var title = chart.append("text")
                .attr("class", "bubble_chartTitle")
                .attr("text-anchor", "middle")//centers the text - without this centering would have to be done by offsetting x coordinate value
                .attr("x", chartWidth / 2)//assigns horizontal position
                .attr("y", 25)//assign verticle position
                .text("Net Natural Gas Imports and Exports By Country for " + expressed)//text content
                //.style("fill", "#810f7c");

            //adding a title [class] to the chart
            var notation = chart.append("text")
                .attr("class", "bubble_chartNotation")
                .attr("text-anchor", "middle")//centers the text - without this centering would have to be done by offsetting x coordinate value
                .attr("x", chartWidth / 2)//assigns horizontal position
                .attr("y", 790)//assign verticle position
                .text("* Gas measurements taken in Milion Cubic Meters at 15 degrees Celcius, 760mm Hg")//text content
                //.style("fill", "#810f7c");
            updateChart(circles, csvData.length, colorScale);
        };        

        //function to create color scale generator - MANUAL BREAKS
        function makeColorScale(data){
            
            //create color scale generator
            var colorScale = d3
                .scaleThreshold()            
                .domain([-10000, -5000, -2500, -1000, -500, 0, 500, 1000, 5000, 10000])
                .range(["#053061", "#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#bcbddc", "#fddbc7", "#f4a582", "#d6604d", "#b2182b", "#67001f"]);
            return colorScale; 
        };        

        function highlight(props){
            //change stroke
            var selected = d3.selectAll("." + props.country.replace("(", '').replace(')',"").replaceAll(/\s+/g, ''))
                .style("stroke", "yellow")
                .style("stroke-width", "3")
                setLabel(props);//calling set label
        };

        function dehighlight(){            

            var circles = d3.selectAll(".circle")
                .style("stroke", "#fff")
                .style("stroke-width", "0.5")

                d3.select(".bubble_infolabel")
                    .remove();
        };        
            
        //function to create dynamic label
        function setLabel(props){
            //label content
            var labelAttribute = "<h1>" + props[expressed] +
                "</h1><b>" + expressed + "</b>";

            //create info label div
            var infolabel = d3.select("body")
                .append("div")
                .attr("class", "bubble_infolabel")
                .attr("id", props.country + "_label")
                .html(labelAttribute);

            var countyName = infolabel.append("div")
                .attr("class", "bubble_labelname")
                .html("<b>" + "Country: "+ props.country +"</b>");            
        };

        //function to move info label with mouse
        function moveLabel(){
            //get width of label
            var labelWidth = d3.select(".bubble_infolabel")
                .node()
                .getBoundingClientRect()
                .width;

            //use coordinates of mousemove event to set label coordinates
            var x1 = event.clientX + 10,
                y1 = event.clientY - 75,
                x2 = event.clientX - labelWidth - 10,
                y2 = event.clientY + 25;

            //horizontal label coordinate, testing for overflow
            var x = event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
            //vertical label coordinate, testing for overflow
            var y = event.clientY < 75 ? y2 : y1; 

            d3.select(".bubble_infolabel")
                .style("left", x + "px")
                .style("top", y + "px");
        };

        //function to update chart circles and titles based on attribute slection
        function updateChart(circles, csvData, colorScale){
            circles.on("mouseover", function(event, d){//event is referring to element being selected
                highlight(d)
            })
            .on("mouseout", function(event, d){
                dehighlight(d)
            })
            .on("mousemove", moveLabel)
            .attr("id", function(d){
                return d[expressed];
            })
            .transition()
            .delay(function(d,i){
                return i * 40
            })
            .duration(1000)
            //sets radius
            .attr("r",function(d){
                //calculate the circle radius based on populations in array
                var area = Math.abs(d[expressed] * .5);
                if (area > 0){
                    return Math.sqrt(area/Math.PI);//converts the area to the radius
                }
                else if (area == 0){
                    return 1;//to display something for 0 values
                }
                else{
                    return Math.abs(Math.sqrt(area/Math.PI));
                }
            })
            //sets circle x coordinate            
            .attr("cx", function(d, i){                
                return x(i) + 15;//spaces the circle width (horizontal axis) using x values
            })
            //sets circle y coordinate 
            .attr("cy", function(d){
                var value = d[expressed];
                if (value >= 0){
                    return y(parseFloat(d[expressed])) - 10;
                }
                else{
                    return Math.min(y(d[expressed])), Math.max(y(d[expressed])) - 10
                }
            })
            //applies color conditionally                        
            .style("fill", function(d){
                var value = d[expressed];
                if (value !== 0){
                    return colorScale(d[expressed]);
                }
                else{
                    return "#969696";
                }
            })
            .style("stroke", "#fff")
            .style("stroke-width", "0.8")       
        
        var chartTitle = d3.select(".bubble_chartTitle")
            .text("Net Natural Gas Imports and Exports By Country for " + expressed)

        createLegend(csvData, expressed, colorScale);
        //createSizeLegend(csvData, expressed, colorScale)
        };

        //function to create legend based on colorScale
        function createLegend(csvData, expressed, colorScale){
            d3.select("body")            
                .append("svg")
                .attr("class", "bubble_legendBox");

            var legend = d3.select("svg.bubble_legendBox");

            legend.append("g")
                .attr("class", "bubble_legend")
                .attr("transform", "translate(15,15)");

            var colorLegend = d3.legendColor()                
                .orient("verticle")
                .ascending(true)
                .scale(colorScale)
                //.title(expressed)
                .title("Legend")
                .labelFormat(",.2r")
                .labelFormat("0")
                .shapeWidth(35)
                .shapeHeight(35)                              
                .labels(d3.legendHelpers.thresholdLabels)                                                

            legend.select(".bubble_legend")
                .call(colorLegend);                           
        };

        /*function createSizeLegend(csvData, expressed, colorScale){
            d3.select("body")            
                .append("svg")
                .attr("class", "size_legendBox");

            var legend = d3.select("svg.size_legendBox");

            legend.append("g")
                .attr("class", "size_legend")
                .attr("transform", "translate(10,15)");

            var sizeLegend = d3.legendSize()                
                .orient("horizontal")
                .ascending(true)
                .scale(circles)
                .title(expressed)
                .labelFormat(",.2r")
                .labelFormat("0")                              
                //.labels(d3.legendHelpers.thresholdLabels)                                                

            legend.select(".size_legend")
                .call(sizeLegend);                           
        };*/
            
})();

    





