
<!DOCTYPE html>
<html lang="en">
<head>
	

	<title>Interactive Choropleth Map - Leaflet - a JavaScript library for interactive maps</title>

	<meta charset="utf-8" />

	

	

	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	

	<link rel="shortcut icon" type="image/x-icon" href="../../docs/images/favicon.ico" />

	<link href="https://leafletjs.com/atom.xml" type="application/atom+xml" rel="alternate" title="Leaflet Dev Blog Atom Feed" />

	<link rel="stylesheet" href="../../docs/css/normalize.css" />
	<link rel="stylesheet" href="../../docs/css/main.css" />
	

	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,300' rel='stylesheet' type='text/css'>

	<script src="../../docs/highlight/highlight.pack.js"></script>
	<link rel="stylesheet" href="../../docs/highlight/styles/github-gist.css" />

	<!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>

	

	<script>
		ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
		MB_ATTR = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
		MB_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + ACCESS_TOKEN;
		OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	</script>
</head>
<body>

<header>
	<h1><a href="https://leafletjs.com/"><img src="../../docs/images/logo.png" alt="Leaflet" width="300" /></a></h1>
	<p class="tagline">an open-source JavaScript library<br> for mobile-friendly interactive maps</p>
</header>

<nav>
	<ul class="nav">
		<li>
			
				<a href="../../index.html">Overview</a>
			
		</li>
		<li>
			
				<a href="../../examples.html">Tutorials</a>
			
		</li>
		<li>
			
				<a href="../../reference.html">Docs</a>
			
		</li>
		<li>
			
				<a href="../../download.html">Download</a>
			
		</li>
		<li>
			
				<a href="../../plugins.html">Plugins</a>
			
		</li>
		<li>
			
				<a href="../../blog.html">Blog</a>
			
		</li>
	</ul>
</nav>

<main>
	<div class="container">
		<p class="tutorials-back"><a href="../../examples.html">&larr; Tutorials</a></p>

<h2 id="interactive-choropleth-map">Interactive Choropleth Map</h2>

<p>This is a case study of creating a colorful interactive <a href="http://en.wikipedia.org/wiki/Choropleth_map">choropleth map</a> of US States Population Density with the help of <a href="../geojson/">GeoJSON</a> and some <a href="/reference.html#control">custom controls</a> (that will hopefully convince all the remaining major news and government websites that do not use Leaflet yet to start doing so).</p>

<p>The tutorial was inspired by the <a href="http://www.texastribune.org/library/data/us-senate-runoff-results-map/">Texas Tribune US Senate Runoff Results map</a> (also powered by Leaflet), created by <a href="http://www.texastribune.org/about/staff/ryan-murphy/">Ryan Murphy</a>.</p>

<table role="presentation">
<tr><td style="text-align: center; border: none; padding: 0;">
<iframe src="example.html" width="816" height="516" style="max-width: 100%; max-height: 90vh; box-sizing: border-box;"></iframe>
</td></tr>
<tr><td style="text-align: center; border: none">
<small><a href="example.html">See this example stand-alone.</a></small>
</td></tr></table>

<h3 id="data-source">Data Source</h3>

<p>We&#8217;ll be creating a visualization of population density per US state. As the amount of data (state shapes and the density value for each state) is not very big, the most convenient and simple way to store and then display it is <a href="../geojson/">GeoJSON</a>.</p>

<p>Each feature of our GeoJSON data (<a href="/examples/choropleth/us-states.js">us-states.js</a>) will look like this:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>{
	"type": "Feature",
	"properties": {
		"name": "Alabama",
		"density": 94.65
	},
	"geometry": ...
	...
}
</code></pre></div></div>

<p>The GeoJSON with state shapes was kindly shared by <a href="http://bost.ocks.org/mike">Mike Bostock</a> of <a href="http://d3js.org/">D3</a> fame, extended with density values from <a href="http://en.wikipedia.org/wiki/List_of_U.S._states_by_population_density">this Wikipedia article</a> based on July 1st 2011 data from <a href="http://www.census.gov/">US Census Bureau</a> and assigned to <code class="language-plaintext highlighter-rouge">statesData</code> JS variable.</p>

<h3 id="basic-states-map">Basic States Map</h3>

<p>Let&#8217;s display our states data on a map with a custom Mapbox style for nice grayscale tiles that look perfect as a background for visualizations:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>var mapboxAccessToken = {your access token here};
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
	id: 'mapbox/light-v9',
	attribution: ...,
	tileSize: 512,
	zoomOffset: -1
}).addTo(map);

L.geoJson(statesData).addTo(map);
</code></pre></div></div>

<table role="presentation">
<tr><td style="text-align: center; border: none; padding: 0;">
<iframe src="example-basic.html" width="600" height="400" style="max-width: 100%; max-height: 90vh; box-sizing: border-box;"></iframe>
</td></tr>
<tr><td style="text-align: center; border: none">
<small><a href="example-basic.html">See this example stand-alone.</a></small>
</td></tr></table>

<h3 id="adding-some-color">Adding Some Color</h3>

<p>Now we need to color the states according to their population density. Choosing nice colors for a map can be tricky, but there&#8217;s a great tool that can help with it &#8212; <a href="http://colorbrewer2.org/">ColorBrewer</a>. Using the values we got from it, we create a function that returns a color based on population density:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function getColor(d) {
	return d &gt; 1000 ? '#800026' :
	       d &gt; 500  ? '#BD0026' :
	       d &gt; 200  ? '#E31A1C' :
	       d &gt; 100  ? '#FC4E2A' :
	       d &gt; 50   ? '#FD8D3C' :
	       d &gt; 20   ? '#FEB24C' :
	       d &gt; 10   ? '#FED976' :
	                  '#FFEDA0';
}
</code></pre></div></div>

<p>Next we define a styling function for our GeoJSON layer so that its <code class="language-plaintext highlighter-rouge">fillColor</code> depends on <code class="language-plaintext highlighter-rouge">feature.properties.density</code> property, also adjusting the appearance a bit and adding a nice touch with dashed stroke.</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function style(feature) {
	return {
		fillColor: getColor(feature.properties.density),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

L.geoJson(statesData, {style: style}).addTo(map);
</code></pre></div></div>

<p>Looks much better now!</p>

<table role="presentation">
<tr><td style="text-align: center; border: none; padding: 0;">
<iframe src="example-color.html" width="600" height="400" style="max-width: 100%; max-height: 90vh; box-sizing: border-box;"></iframe>
</td></tr>
<tr><td style="text-align: center; border: none">
<small><a href="example-color.html">See this example stand-alone.</a></small>
</td></tr></table>

<h3 id="adding-interaction">Adding Interaction</h3>

<p>Now let&#8217;s make the states highlighted visually in some way when they are hovered with a mouse. First we&#8217;ll define an event listener for layer <code class="language-plaintext highlighter-rouge">mouseover</code> event:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie &amp;&amp; !L.Browser.opera &amp;&amp; !L.Browser.edge) {
		layer.bringToFront();
	}
}
</code></pre></div></div>

<p>Here we get access to the layer that was hovered through <code class="language-plaintext highlighter-rouge">e.target</code>, set a thick grey border on the layer as our highlight effect, also bringing it to the front so that the border doesn&#8217;t clash with nearby states (but not for IE, Opera or Edge, since they have problems doing <code class="language-plaintext highlighter-rouge">bringToFront</code> on <code class="language-plaintext highlighter-rouge">mouseover</code>).</p>

<p>Next we&#8217;ll define what happens on <code class="language-plaintext highlighter-rouge">mouseout</code>:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function resetHighlight(e) {
	geojson.resetStyle(e.target);
}
</code></pre></div></div>

<p>The handy <code class="language-plaintext highlighter-rouge">geojson.resetStyle</code> method will reset the layer style to its default state (defined by our <code class="language-plaintext highlighter-rouge">style</code> function). For this to work, make sure our GeoJSON layer is accessible through the <code class="language-plaintext highlighter-rouge">geojson</code> variable by defining it before our listeners and assigning the layer to it later:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>var geojson;
// ... our listeners
geojson = L.geoJson(...);
</code></pre></div></div>

<p>As an additional touch, let&#8217;s define a <code class="language-plaintext highlighter-rouge">click</code> listener that zooms to the state:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
</code></pre></div></div>

<p>Now we&#8217;ll use the <code class="language-plaintext highlighter-rouge">onEachFeature</code> option to add the listeners on our state layers:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);
</code></pre></div></div>

<p>This makes the states highlight nicely on hover and gives us the ability to add other interactions inside our listeners.</p>

<h3 id="custom-info-control">Custom Info Control</h3>

<p>We could use the usual popups on click to show information about different states, but we&#8217;ll choose a different route &#8212; showing it on state hover inside a <a href="/reference.html#control">custom control</a>.</p>

<p>Here&#8217;s the code for our control:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML = '&lt;h4&gt;US Population Density&lt;/h4&gt;' +  (props ?
		'&lt;b&gt;' + props.name + '&lt;/b&gt;&lt;br /&gt;' + props.density + ' people / mi&lt;sup&gt;2&lt;/sup&gt;'
		: 'Hover over a state');
};

info.addTo(map);
</code></pre></div></div>

<p>We need to update the control when the user hovers over a state, so we&#8217;ll also modify our listeners as follows:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>function highlightFeature(e) {
	...
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	...
	info.update();
}
</code></pre></div></div>

<p>The control also needs some CSS styles to look nice:</p>

<div class="language-plaintext css highlighter-rouge"><div class="highlight"><pre class="highlight"><code>.info {
	padding: 6px 8px;
	font: 14px/16px Arial, Helvetica, sans-serif;
	background: white;
	background: rgba(255,255,255,0.8);
	box-shadow: 0 0 15px rgba(0,0,0,0.2);
	border-radius: 5px;
}
.info h4 {
	margin: 0 0 5px;
	color: #777;
}
</code></pre></div></div>

<h3 id="custom-legend-control">Custom Legend Control</h3>

<p>Creating a control with a legend is easier, since it is static and doesn&#8217;t change on state hover. JavaScript code:</p>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i &lt; grades.length; i++) {
		div.innerHTML +=
			'&lt;i style="background:' + getColor(grades[i] + 1) + '"&gt;&lt;/i&gt; ' +
			grades[i] + (grades[i + 1] ? '&amp;ndash;' + grades[i + 1] + '&lt;br&gt;' : '+');
	}

	return div;
};

legend.addTo(map);
</code></pre></div></div>

<p>CSS styles for the control (we also reuse the <code class="language-plaintext highlighter-rouge">info</code> class defined earlier):</p>

<div class="language-plaintext css highlighter-rouge"><div class="highlight"><pre class="highlight"><code>.legend {
	line-height: 18px;
	color: #555;
}
.legend i {
	width: 18px;
	height: 18px;
	float: left;
	margin-right: 8px;
	opacity: 0.7;
}
</code></pre></div></div>

<p>Enjoy the result on the top of this page, or on a <a href="example.html">separate page</a>.</p>

	</div>
</main>

<footer class="container">
	<div class="footer">
		<p>&copy; 2010–2022 <a href="http://agafonkin.com/en">Vladimir Agafonkin</a>. Maps &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.</p>
	</div>

	<nav class="ext-links">
	  <a class="ext-link twitter" href="https://twitter.com/LeafletJS" title="Follow LeafletJS on Twitter"><img alt="Follow LeafletJS on Twitter" src="../../docs/images/twitter-round.png" width="46" /></a>
	  <a class="ext-link github" href="http://github.com/Leaflet/Leaflet" title="View Source on GitHub"><img alt="View Source on GitHub" src="../../docs/images/github-round.png" width="46" /></a>
	  <a class="ext-link forum" href="https://stackoverflow.com/questions/tagged/leaflet" title="Ask for help on Stack Overflow"><img alt="Leaflet questions on Stack Overflow" src="../../docs/images/forum-round.png" width="46" /></a>
	</nav>
</footer>

<script>
	var _gaq = _gaq || [];
	_gaq.push([ '_setAccount', 'UA-4147697-4' ]);
	_gaq.push([ '_trackPageview' ]);

	(function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl'
				: 'http://www')
				+ '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	})();
</script>

<script src="../../dialog/dialog.js"></script>
<script src="../../docs/js/docs.js"></script>

</body>
</html>
