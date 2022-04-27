//declare map variable in global scope
var map;
//declare the min value and max value in global scope 
//var dataStats = {};
var minValue;
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

function calculateMinValue(data){
    //var attribute = attributes[0];
    //console.log(attributes)
    //var year = Number(attribute.split("-")[0])
    //var month = Number(attribute.split("-")[1])
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var City of data.features){
        //loop through each year
        for (var year = 2019; year <= 2022; year +=1){
            //for (var month = 1; month <= 12; month += 1) {
                //get population for current year
            var value = City.properties["2019-" + String(year)];
            console.log(value)    
            //add value to array
            allValues.push(value);
            //}
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = .05;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/1,0.5715) * minRadius

    return radius;
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "2019-01";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};


//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/NetBorderX.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)