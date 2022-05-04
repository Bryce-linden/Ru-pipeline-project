//declare map variable in global scope
var map;

var minValues = {};

//declare the min value and max value in global scope 
var dataStats = {};

var expressed = "Y2019-01"

//var monthSelect = elem.target.options[elem.target.options.selectedIndex].value

//var yearSelect = elem.target.options[elem.target.options.selectedIndex].value

//function to instantiate the leaflet map
function createMap(){
    map = L.map('map', {
        center: [50, 11],
        zoom: 4
        //minZoom: 3,
        //maxBounds: [
        //    [65, -155],
        //    [23, -35]
        //    ]
    });

    //'https://api.mapbox.com/styles/v1/jinskeep/cl0im49qp000k15muijdwfann/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiamluc2tlZXAiLCJhIjoiY2wwaWhwZWIwMDJxODNvb3Q1Mm1zMzJwMyJ9.YJAm8B6G0iBkf0wIiCKSfA'

    //Add custom base tilelayer
    var Stadia_AlidadeSmoothDark = L.tileLayer('https://api.mapbox.com/styles/v1/blinden/cl22cbrjy000o14l69xhpbm4r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map)
        //call the getData function

    getData(map); //add map at some point
};



function calcStats(data, attributes) {
   

    //create empty array to store all data values
    
    //var year = data[0]
    //var month = data[1]
    //loop through each city
   for (var attribute of attributes) {
        var allValues = [];
        for (var feature of data.features){
            //console.log(feature)
            if (feature.properties[attribute])
                allValues.push(feature.properties[attribute])

        }
       
        //minValues[attribute] = Math.min(...allValues)
        dataStats.min = Math.min(...allValues)
        dataStats.max = Math.max(...allValues);

        var sum = allValues.reduce(function (a,b) {
            return a + b;
        });
        dataStats.mean = sum /allValues.length; 
   
        //Local year variable that pulls out the year
        
        //Comparing local year variable to the constraints
        //split function - split - the date property on the hyphen First year second month assign local variable to year and month
        //for retrieval same thing 
        //loop through each year


    } 
    //console.log(minValues)

};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    //use conditional if else statement if value 0, eg if attValue == 0 return else return all else
    var minRadius = .075;
    //flannery Appearance compensation formula
    var radius = 1.0083 * Math.pow(attValue/1,0.715) * minRadius;
    //console.log(radius)
    return radius;
    
};

//create popup content 
function PopupContent(properties, attribute){
    //add the city popup content string
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("-")[0]; // index for year 
    this.month = attribute.split("-")[1] // index for month
    this.gas = this.properties[attribute]; //this.gas is properties attribute
    

    this.formatted = "<p><b>Border Crossing:</b> " + this.properties.City + "</p><p><b>Net import of Gas for " + this.year + " in the month of  " + this.month + ": </b>" + this.gas + " Whatever the unit is</p>";

};


//Function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute value to visualize with proportional symbols
   // var attribute = attributes[0];
    //console.log(attribute)

    //create marker options
    var options = {
        fillColor: "#00bbff", //"#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        
    };

    //For each feature, determine its value for the selected attribute 
    var attValue = Number(feature.properties[expressed]);
    //console.log(attValue)

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //Create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with city
    var popupContent = new PopupContent(feature.properties, expressed);

    
    //Bind the popup to the circle marker addin an offset to each circle marker as to not cover symbol
    layer.bindPopup(popupContent.formatted, {
        offset: new L.Point(0,-options.radius) 
    });

    //return the circle marker to the L.geojson pointToLayer option
    return layer;
};

//add circle markers or point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON Layer and add it to map 
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//NEEDED FOR FINAL LAB
function getCircleValues(attribute) {
    //start with min at highest possible and max at lowest possible number
    var min = Infinity, 
    max = -Infinity;

    map.eachLayer(function (layer) {
        //get the attribute value
        if (layer.feature) {
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min) {
                min = attributeValue;
            }

            //Test for max
            if (attributeValue > max) {
                max = attributeValue;
            }
        
        }
    });

        //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min,
    };

};

function updateLegend(attribute) {
    //create content for legend 
    var year = attribute.split("-")[0];
    //var month = attribute.split("-")[1]
    //replace legend content
    document.querySelector("span.year").innerHTML = year;
    
    //get the max, mean and min values as an object
    var circleValues = getCircleValues(attribute);

    for (var key in circleValues) {
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        document.querySelector("#" + key).setAttribute("cy", 54 - radius);
        document.querySelector("#" + key).setAttribute("r", radius)

        document.querySelector("#" + key + "-text").textContent = Math.round(circleValues[key] * 100) / 100 + " Gas Unit of IMPORT/EXPORT";
    }
};    

function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add ski area  to popup content string
            var popupContent =  new PopupContent(props, attribute);

            

            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent.formatted).update();
        };
    });

    updateLegend(attribute);
};   

//Create an array of the sequential attributes
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    console.log(properties)

    //push each attribute name into the attribute array
    for (var attribute in properties){
        //console.log(attribute.indexOf("Y"))
        //only take attributes with gas values
        if (attribute.indexOf("Y") == 0){
            attributes.push(attribute);
        };
    };

    //check the resulg
    //console.log(attributes);

    return attributes;
}; 



    var months = { // This is a utility object to make it easier to work the particular format that our data requires
        "January":"01"
        ,"February":"02"
        ,"March":"03"
        ,"April":"04"
        ,"May":"05"
        ,"June":"06"
        ,"July":"07"
        ,"August":"08"
        ,"September":"09"
        ,"October":"10"
        ,"November":"11"
        ,"December":"12"
    };
    
    
    var monthsIndex = { // This is a set of key:value pairs that maps the particular label for each data item/index to the 0 to 36 index values that the update function requires
        "Y2019-01": 0,
    "Y2019-02": 1,
    "Y2019-03": 2,
    "Y2019-04": 3,
    "Y2019-05": 4,
    "Y2019-06": 5,
    "Y2019-07": 6, 
    "Y2019-08": 7,
    "Y2019-09": 8,
    "Y2019-10": 9,
    "Y2019-11": 10,
    "Y2019-12": 11,
    "Y2020-01": 12,
    "Y2020-02": 13,
    "Y2020-03": 14,
    "Y2020-04": 15,
    "Y2020-05": 16,
    "Y2020-06": 17,
    "Y2020-07": 18,
    "Y2020-08": 19,
    "Y2020-09": 20,
    "Y2020-10": 21,
    "Y2020-11": 22,
    "Y2020-12": 23,
    "Y2021-01": 24,
    "Y2021-02": 25,
    "Y2021-03": 26,
    "Y2021-04": 27,
    "Y2021-05": 28,
    "Y2021-06": 29,
    "Y2021-07": 30,
    "Y2021-08": 31,
    "Y2021-09": 32,
    "Y2021-10": 33,
    "Y2021-11": 34,
    "Y2021-12": 35,
    "Y2022-01": 36
    }

var yearSet = document.querySelector('#year-select') // Select the dropdown with the years so we can grab the value to make the index that will update the map

console.log(monthSet); // Confirm it's the right element

var monthSet = document.querySelector("#month-select"); // Same, but for months



var changeButton = document.querySelector("#updateSymbolsButton") // Select the HTML element to receive an event listener and perform a function

.addEventListener('click',function(){ // Add the event listener for the event 'click', and run a function (which we haven't given a specific name to b/c it is only getting called here and we don't need a human-friendly name for it)
    console.log(monthSet.value); // double-check that it's the correct value.
    var updateIndexString; // Create a variable to eventually fill with the string we'll use to grab the right index from our data
    updateIndexString = "Y"+yearSet.value+"-"+months[monthSet.value]; // Actually build the string of text that we'll use to grab the right data index from our object above
    console.log(updateIndexString); // Confirm it looks correct
    var useThisIndex; // Create index to hold the value that we get from our months index
    console.log(monthsIndex[updateIndexString]); // Confirm that using the string we built can accurately spit out the index we need
    useThisIndex = monthsIndex[updateIndexString]; 
    updatePropSymbols(globalAttributes[useThisIndex]) // The Leaflet magic that actually updates the map, using the index built from our dropdown-menu values, and the Attributes that the code generates
});
    
    
    
    



function createDropDownFilter(attributes){
    //loop to get year/month list
    //var htmlToAdd = '';
    var year = ["2019", "2020", "2021", "2022"]
    //var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    year.forEach(function(item){
        document.querySelector('#year-select').insertAdjacentHTML('beforeend','<option value="'+ item +'">' + item + '</option>');

    } )

    document.querySelector('#year-select').addEventListener("change", function(elem){ //look into what event is for dropdown menu ,, may be change
        console.log(elem.target.options[elem.target.options.selectedIndex].value)
        return elem.target.options[elem.target.options.selectedIndex].value;
                    //store as global variable as well as month
    })
    month.forEach(function(item){
        document.querySelector('#month-select').insertAdjacentHTML('beforeend','<option value="'+ item +'">' + item + '</option>');
    })
    document.querySelector('#month-select').addEventListener("change", function(elem){ //look into what event is for dropdown menu ,, may be change
        console.log(elem.target.options[elem.target.options.selectedIndex].value)
        return elem.target.options[elem.target.options.selectedIndex].value;
                //store as global variable as well as month
    })

    //var monthSect = document.querySelector('#year-select')

    //write a function thatll go through spit out the thing to grab Y2022-01
    //have submit button trigger JS thatll look at year and month
    //combine to string
    //match that to 
    
   
};

//Step 1: Create new sequence controls
function createSequenceControls(attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            //create the control container div with a particular class name 
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">');

            //add skip buttons
            container.insertAdjacentHTML('beforeend', '<button class ="step" id="reverse" title="Reverse"><img src="img/reverse.png"></button>');

            container.insertAdjacentHTML('beforeend', '<button class ="step" id="forward" title="Forward"><img src="img/forward.png"></button>');

            L.DomEvent.disableClickPropagation(container);

            return container;

        }
    });

    map.addControl(new SequenceControl());
    //add listeners after adding control
    //set slider attributes
    document.querySelector(".range-slider").max = 36;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    var steps = document.querySelectorAll('.step');

    //add step buttons
    steps.forEach(function(step){
        step.addEventListener("click", function(){ //look into what event is for dropdown menu ,, may be change
            var index = document.querySelector('.range-slider').value;
            //console.log(index);
            //increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //if past the last attribute, wrap around to first attribute
                index = index > 36 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //if past the first attribute, wrap around to last attribute
                index = index < 0 ? 36 : index;
            };

            //update slider
            document.querySelector('.range-slider').value = index;
            //pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })
    })

    //input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        var index = this.value;
        console.log(index);
        updatePropSymbols(attributes[index]);
    });
};

//function to create legend 
function createLegend(attributes) {
    var LegendControl = L.Control.extend({
        options: {
            position: "bottomright",
        },

        onAdd: function () {
            //create the control container with a particular class name 
            var container = L.DomUtil.create("div", "legend-control-container");

            container.innerHTML = '<p class="temporalLegend">Gas in <span class="year">2019</span></p>';

            //Start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

            //array of circle names to base loop on 
            var circles = ["max", "mean", "min"];
            
            //Loop to add each circle and text to svg string
            for (var i = 0; i < circles.length; i++) {
                //calculate r and cy
                var radius = calcPropRadius(dataStats[circles[i]]);
                //console.log(radius);
                var cy = 54 - radius;
                //console.log(cy);

                //circle string
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '" cy="' + cy + '" fill="#00bbff" fill-opacity="0.8" stroke="#000000" cx="30"/>';

                //evenly space out labels
                var textY = i * 20 + 10;

                //text string 
                svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + Math.round(dataStats[circles[i]] *100) / 100 + " inches" + "</text>";
            }

            //close svg string
            svg += "</svg>";

            //add attribute legend to container
            container.insertAdjacentHTML('beforeend',svg);

            return container;
        },
    });//minValues[attribute] = Math.min(...allValues)

    map.addControl(new LegendControl());
}    

 

//function to retrieve the data and place it on the map
function getData(map){ //add map to parantheses at some point
    //load the data
    fetch("data/NetBorderX.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //createPropSymbols(json);
            var attributes = processData(json);
            globalAttributes = processData(json);
            //console.log(attributes)
            calcStats(json, attributes)
            //create marker options
            //callfunction to create proportional symbols
            createDropDownFilter(attributes);
            createPropSymbols(json, attributes);
            //createSequenceControls(attributes);
            createLegend(attributes);
        })
    
};
document.addEventListener('DOMContentLoaded', createMap)    


