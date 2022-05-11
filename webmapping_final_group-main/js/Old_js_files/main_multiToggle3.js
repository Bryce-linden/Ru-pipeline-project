(function(){    
    
    var attrArray = ["2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01"]; //list of attributes    
    var expressed = attrArray[0]; //initial attribute
    var structuredData = [];

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 70, left: 50},
        width = 1500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.timeParse("%Y-%m");

    // Set the ranges
    var x = d3.scaleTime()    
        .range([0, width])
        
    var y = d3.scaleLinear()
        .range([height, 0])
            

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

    function callback(data) {}
    // Get the data
    d3.csv("data/BorderXing2.csv").then(function(data) {

        var dates = [];

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
        console.log(structuredData)
        
        // Scale the range of the data
        x.domain(d3.extent(structuredData, function(d) {
            return d.date; }));
        y.domain([0, d3.max(structuredData, function(d) {
            return d.value; })]);

        // Group the entries by symbol
        /*dataNest = Array.from(
            d3.group(data, d => d.symbol), ([key, value]) => ({key, value})
        );*/

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
                //.attr("class", "line") //ADD COUNTRY TO CLASS NAME
                .attr("class", function(){
                    return "line" + d.key;
                })
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(d.value); })
                .attr("id", function(){
                    return 'tag' +d.key.replace("(", '').replace(')',"").replace(/\s+/g, '')
                }) // assign an ID
            
                .attr("d", linePath(d.value));
        });
        
        dataNest2.forEach(function(d,i) {
            // Add the Legend
            svg.append("text")            
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 10)            
                .attr("class", "legend")    // style the legend
                .style("fill", function() { // Add the colours dynamically
                    return d.color = color(d.value); })
                .attr("id", function(){
                    return 'tag' +d.key.replace("(", '').replace(')',"").replace(/\s+/g, '')
                })
                .on("click", function(){
                    // Determine if current line is visible 
                    var active   = d.active ? false : true,
                    newOpacity = active ? 0 : 1; 
                    // Hide or show the elements based on the ID
                    d3.select("#tag"+d.key.replace("(", '').replace(')',"").replace(/\s+/g, ''))
                        .transition().duration(500) 
                        .style("opacity", newOpacity); 
                    // Update whether or not the elements are active
                    d.active = active;
                    })  
                .text(d.key);
        });
        
        //FUNCTION DATANEST2.FOREACH(D)
        //ADD LEGEND FOR THE COUNTRY

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")                 
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

    });

    //function to create dynamic label
    function setLabel(dataNest){
        //label content
        var labelAttribute = "<h2>" + d.key +
            "</h2><b>" + d.value + "</b>";

        //create info label div
        var infolabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel")
            .attr("id", d.key + "_label")
            .html(labelAttribute);

        var countyName = infolabel.append("div")
            .attr("class", "labelname")
            .html("<b>" + d.key +"</b>" + d.value);            
    };

    function highlight(city){
        //change stroke
        var selected = d3.selectAll("." + d.City)
            .style("stroke", "#d7301f")
            .style("stroke-width", "3")
            setLabel(city);//calling set label
    };

    function dehighlight(){
        //change stroke
        var cities = d3.selectAll(".city")
            .style("stroke", "rgb(250, 250, 250)")
            .style("stroke-width", "0.75")

        var lines = d3.selectAll(".line")
            .style("stroke", "#fff")
            .style("stroke-width", "0.5")

            d3.select(".infolabel")
                .remove();
    };
    
})();