

//var minValue;
var dataStats = {};

//keep everything in the createMap function. The functions getcolor and style seem to work properly
function createMap(statesData){

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
    

    //var choropleth = L.layerGroup();


    var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    var mbUrlgroov = 'https://api.mapbox.com/styles/v1/blinden/ckv0a1c4m0jqc14ofmm49yj72/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ'
    var mbAttrgroov = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	var streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    var groovy = L.tileLayer(mbUrlgroov, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttrgroov});

    //create the map
    var map = L.map('mapid', {
        center: [50, 10], //center map on central Wisconsin
        zoom: 4,
        layers: [grayscale, cities]
    });

    var SmoothDark = L.tileLayer('https://api.mapbox.com/styles/v1/blinden/cl22cbrjy000o14l69xhpbm4r/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmxpbmRlbiIsImEiOiJja3RicnN2aXQxejJnMm9yNXJ5ODdnZnlzIn0.xxMkVduVt5ll-Trxg1qBPQ', {
	maxZoom: 20,
	attribution: 'Map data &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map)
    
    //L.geoJson(statesData).addTo(map); //!!!!!var statesData is defined in the js file us-states.js

    var baseLayers = {
		'Grayscale': grayscale,
        'Smooth Gray': SmoothDark, //when I move this line of code above 'Grayscale', the starting basemap is grayscale, but the legend is correct with smooth dark as the first option
		'Streets': streets,
        'Groovy': groovy
	};


    var overlays = {
		'Cities': cities, //'Cities' represents the text that you see for the button on the interface. cities (the blue one) is the variable in the code
        //'Choropleth': choropleth
        
	};

    var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
    
    var satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	layerControl.addBaseLayer(satellite, "Satellite");
        








    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    //console.log("pop density")
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4> Gas units</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a region');
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



document.addEventListener('DOMContentLoaded',createMap)
