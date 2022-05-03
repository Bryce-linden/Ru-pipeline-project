//declare map variable in global scope
var map;

var minValues = {};


//declare the min value and max value in global scope 
var dataStats = {};
var attributes
var bordercrossings
var expressed = "Y2019-01"

//function to instantiate the leaflet map
function createMap(){

    var oil_icon = L.icon({
        iconUrl: 'lib/oil_barrel.png',
        
    
        iconSize:     [18, 24], // size of the icon
       // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var cities = L.layerGroup(); //create empty variable layer group that you will fill with array
    var mLittleton = L.marker([39.61, -105.02], {icon:oil_icon}).bindPopup('This is Littleton, CO.').addTo(cities);
    var mDenver = L.marker([39.74, -104.99],{icon:oil_icon}).bindPopup('This is Denver, CO.').addTo(cities);
    var mAurora = L.marker([39.73, -104.8],{icon:oil_icon}).bindPopup('This is Aurora, CO.').addTo(cities);
    var mGolden = L.marker([39.77, -105.23],{icon:oil_icon}).bindPopup('This is Golden, CO.').addTo(cities);
  
  
  
    var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    var mbUrlgroov = 'https://api.mapbox.com/styles/v1/blinden/ckv0a1c4m0jqc14ofmm49yj72/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ'
    var mbAttrgroov = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
  
  
    var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var groovy = L.tileLayer(mbUrlgroov, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttrgroov});
  



    map = L.map('map', {
        center: [50, 11],
        zoom: 4
        //minZoom: 3,
        //maxBounds: [
        //    [65, -155],
        //    [23, -35]
        //    ]
    });
    map.options.layers = [grayscale, bordercrossings];
    

    //Add custom base tilelayer
    var Stadia_AlidadeSmoothDark = L.tileLayer('https://api.mapbox.com/styles/v1/blinden/cl22cbrjy000o14l69xhpbm4r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map)
        //call the getData function, but not when the data is too big! It won't load in time
    var baseLayers = {
        'Grayscale': grayscale,
        'Smooth Gray': Stadia_AlidadeSmoothDark, //when I move this line of code above 'Grayscale', the starting basemap is grayscale, but the legend is correct with smooth dark as the first option
        'Streets': streets,
        'Groovy': groovy
        };
    
    var overlays = {
        'Border Crossings': bordercrossings
    
            //'Cities' represents the text that you see for the button on the interface. cities (the blue one) is the variable in the code
           
        
        };
    console.log("this is border crossings", bordercrossings)
    var layerControl = L.control.layers(baseLayers,overlays).addTo(map); 
    var satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    layerControl.addBaseLayer(satellite, "Satellite");
    //getData(map); //add map at some point
};



function calcStats(data, attributes) {
   
  
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
   

    } 
    //console.log(minValues)

};


//BEGIN CHOROPLETH! ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function makechoropleth(){
    // control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>2019</h4>' +  (props ?
			'<b>' + props.ADMIN + '</b><br />' + props.Y2019 + ' meters^3 ' : 'Hover over a country!');
			console.log("props:", props)
	};
	
	info.addTo(map);

 //This color scheme gives you purple as middle values
	// function getColor(d) {
	// 	return d >= 12215 ? '#F50000' :
	// 		d >= 9855 ? '#E8005F' :
	// 		d >= 7374 ? '#4600C2' :
	// 		d >= 5152 ? '#9F00CE' :
	// 		d >= 2520 ? '#3F13B5' :
	// 		d >= -3702 ? '#4600C2' :
	// 		d >= -7280 ? '#0009B5' : 
	// 		'#fff5f0';
	// }

    function getColor(d) {
		return d >= 12215 ? '#b2182b' :
			d >= 9855 ? '#ef8a62' :
			d >= 7374 ? '#fddbc7' :
			d >= 5152 ? '#f7f7f7' :
			d >= 2520 ? '#d1e5f0' :
			d >= -3702 ? '#67a9cf' :
			d >= -7280 ? '#2166ac' : 
			'#fff5f0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.Y2019)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#FC4E2A',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	/* global statesData */
	geojson = L.geoJson(alleuro, {
		style: style,
		onEachFeature: onEachFeature,
	}).addTo(map);
	

	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


	var legend = L.control({position: 'bottomleft'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend');
		
        var grades = [12215, 9855, 7374, 5152, 2520, -3702, -7280];
		var labels = [];
		var from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

            labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
}

//end choropleth function ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    //use conditional if else statement if value 0, eg if attValue == 0 return else return all else
    var minRadius = .06;
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

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//add circle markers or point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON Layer and add it to map 
    bordercrossings = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    });
};



// function style(feature) {
//     return {
//         fillColor: getColor(feature.properties.density),
//         weight: 2,
//         opacity: 1,
//         color: 'green',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
// }




//FOR CHOROPLETH
//create new function similar to createpropsymbols
// Plug in json variable into parethesis in function
// style : style

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

function cascadingDropdown(attributes){ //Put attributes in parantheses?
    var subjectObject = {
        "Month": {
          "January": ["2019", "2020", "2021", "2022"],
          "February": ["2019", "2020", "2021", "2022"],
          "March": ["2019", "2020", "2021", "2022"],
          "April": ["2019", "2020", "2021", "2022"],
          "May": ["2019", "2020", "2021", "2022"],
          "June": ["2019", "2020", "2021", "2022"],
          "July": ["2019", "2020", "2021", "2022"],
          "August": ["2019", "2020", "2021", "2022"],
          "September": ["2019", "2020", "2021", "2022"],
          "October": ["2019", "2020", "2021", "2022"],
          "November": ["2019", "2020", "2021", "2022"],
          "December": ["2019", "2020", "2021", "2022"]
        }
      }

     
      window.onload = function() {
        var monthSel = document.getElementById("month");
        var yearSel = document.getElementById("year");
        for (var y in subjectObject) {
          monthSel.options[monthSel.options.length] = new Option(y, y);
        }
        monthSel.onchange = function() {
          //empty Chapters- and Topics- dropdowns
          //chapterSel.length = 1;
          yearSel.length = 1;
          var z = subjectObject[monthSel.value][this.value];
          //display correct values
          for (var i = 0; i < z.length; i++){
            yearSel.options[yearSel.options.length] = new Option(z[i], z[i]);
          }
        }
        
    }
    

}
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
        step.addEventListener("click", function(){
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
    //    console.log(index);
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
function getData(){ //add map to parantheses at some point
    //load the data
    fetch("data/NetBorderX.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            console.log("This is function getData:" , json)
            //createPropSymbols(json);
            attributes = processData(json);
            //console.log(attributes)
            calcStats(json,attributes)
            //create marker options
            //callfunction to create proportional symbols
            cascadingDropdown();
            createPropSymbols(json, attributes);
            createMap();
            createSequenceControls(attributes);
            createLegend(attributes);
            makechoropleth();
        })
    
};
document.addEventListener('DOMContentLoaded', getData)    




