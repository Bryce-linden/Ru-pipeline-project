(function(){    
    
    var attrArray = ["2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01"]; //list of attributes    
    var structuredData = [];    

    // Set the dimensions of the canvas / graph
    var margin = {top: 50, right: 20, bottom: 70, left: 50},
        width = 1800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    window.onload = setChart();

    function setChart(){
        // Parse the date / time
        var parseDate = d3.timeParse("%Y-%m");

        // Set the ranges
        var x = d3.scaleTime()    
            .range([0, width])
            
        var y = d3.scaleLinear()
            .range([height, 20])                

        // Define the line
        var linePath = d3.line()	
            .x(function(d) { 
                return x(d.date); })
            .y(function(d) { 
                return y(d.value); });
            
        // Adds the svg canvas
        var svg = d3.select("body")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

        var title = svg.append("text")
            .attr("class", "chartTitle")
            .attr("text-anchor", "middle")//centers the text - without this centering would have to be done by offsetting x coordinate value
            .attr("x", width / 2)//assigns horizontal position
            .attr("y", 0)//assign verticle position
            .text("Natural Gas Flows At Border Crossings For Select European Countries (2019 to 2022)")//text content   
        
        // Get the data
        d3.csv("data/BorderXing3.csv").then(function(data) {            

            data.forEach(function(item){                
                attrArray.forEach(function(date){
                    var obj = {
                        country:item.Country,
                        city:item.City,                
                        date:parseDate(date),
                        value:parseFloat(item[date])
                    }
                    structuredData.push(obj)
                })
            })            
            
            // Scale the range of the data
            x.domain(d3.extent(structuredData, function(d) {
                return d.date; }));
            y.domain([0, d3.max(structuredData, function(d) {
                return d.value; })]);            

            dataNest = Array.from(
                d3.group(structuredData, d => d.city), ([key, value]) => ({key, value})
            );            

            //CREATE SECOND DATANEST WITH D.COUNTRY AS KEY
            dataNest2 = Array.from(
                d3.group(structuredData, d => d.country), ([key, value]) => ({key, value})
            );
            
            // set the colour scale
            var color = d3.scaleOrdinal(d3.schemeCategory10);            

            legendSpace = width/dataNest2.length; // spacing for the legend

            // Loop through each symbol / key
            dataNest.forEach(function(d,i) { 
                svg.append("path")                    
                    .datum(d)
                    .attr("class", function(){                        
                        return "cityLine line" + d.key.replace("(", '').replace(')',"").replaceAll(/\s+/g, '') + " " + d.value[0].country.replace(/\s+/g, '');
                    })
                    .style("stroke", function() { // Add the colours dynamically
                        return d.color = color(d.value[0].country) })
                    .attr("id", function(){
                        return 'tag' +d.key.replace("(", '').replace(')',"").replaceAll(/\s+/g, '')
                    }) // assign an ID                
                    .attr("d", linePath(d.value))                    
                    .on("mouseover", function(event){//event is referring to element being selected                        
                        highlight(d.key.replace("(", '').replace(')',"").replaceAll(/\s+/g, ''),d)
                    })
                    .on("mouseout", function(event){
                        dehighlight(d)
                    })
                    .on("mousemove", moveLabel)
                        .attr("id", function(d){
                            return d;
                    })
                    .transition()
                    .delay(function(d,i){
                        return i * 20
                    })
                    .duration(1000);
            });
            
            dataNest2.forEach(function(d,i) {            
                // Add the Legend
                svg.append("text")            
                .attr("x", legendSpace*i)  // space legend
                .attr("y", height + (margin.bottom/2) + 10)            
                    .attr("class", "legend")    // style the legend
                    .style("fill", function() { // Add the colours dynamically
                        return d.color = color(d.value[0].country); })
                    .attr("id", function(){
                        return 'tag' + d.key.replace("(", '').replace(')',"").replace(/\s+/g, '')//replaces space
                    })
                    .on("click", function(){
                        // Determine if current line is visible 
                        var active = d.active ? false : true,
                        newOpacity = active ? 0 : 1; 
                        // Hide or show the elements based on the ID
                        d3.selectAll("."+d.key.replace("(", '').replace(')',"").replaceAll(/\s+/g, ''))
                            .transition().duration(500) 
                            .style("opacity", newOpacity); 
                        // Update whether or not the elements are active
                        d.active = active;
                        })  
                    .text(d.key);
            });           

            // Add the X Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")                 
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y));
        
    function moveLabel(){
        //get width of label
        var labelWidth = d3.select(".infolabel")
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

        d3.select(".infolabel")
            .style("left", x + "px")
            .style("top", y + "px");
        };        

    function highlight(key, d){
        //change stroke
        var selected = d3.selectAll(".line" + key)
            .style("stroke", "blue")
            .style("stroke-width", "4")
            setLabel(d);//calling set label
        };
        
    function dehighlight(){
        //change stroke
        var lines = d3.selectAll(".cityLine")
            .style("stroke", function(d) { // Add the colours dynamically
                return d.color = color(d.value[0].country) })
            .style("stroke-width", "2")

            d3.select(".infolabel")
                .remove();
        };

    //function to create dynamic label
    function setLabel(d){
        //label content - border crossing name
        var labelAttribute = "<h2>" + d.key + ", " + d.value[0].country +
            "</h2><b>";

        //create info label div
        var infolabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", d.key + "_label")
            .html(labelAttribute);        
        };        
    });            
};    
})();