

//var minValue;
var dataStats = {};

//keep everything in the createMap function. The functions getcolor and style seem to work properly
function createMap(){

    //create the map
    var map = L.map('mapid', {
        center: [50, 10], //center map on central Wisconsin
        zoom: 4
    });

    var Stadia_AlidadeSmoothDark = L.tileLayer('https://api.mapbox.com/styles/v1/blinden/cl22cbrjy000o14l69xhpbm4r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map)

    //L.geoJson(statesData).addTo(map); //!!!!!var statesData is defined in the js file us-states.js


    
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

//console.log("pop density")
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(map);

function getColor(d) {
    return d > 1000 ? '#6e016b' :
            d > 500  ? '#88419d' :
            d > 200  ? '#8c6bb1' :
            d > 100  ? '#8c96c6' :
            d > 50   ? '#9ebcda' :
            d > 20   ? '#bfd3e6' :
            d > 10   ? '#e0ecf4' :
                        '#f7fcfd';
}

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

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 7,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
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
    geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');




var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];
        var from, to;

    // loop through our density intervals and generate a label with a colored square for each interval
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

};

function getData(){
    //load the data
    fetch("data/Europe_shapefiles/Belgiumtest.json")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            attributes = processData(json);
            calcStats(json)
            console.log('test fetch function')
            //call function to create proportional symbols, call all 3
            createPropSymbols(json, attributes);
            createMap();
            createSequenceControls(attributes);
            createLegend(attributes);
        })
  };

document.addEventListener('DOMContentLoaded',createMap)
