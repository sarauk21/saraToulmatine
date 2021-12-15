//alert("  hi   i am in script file");






//    first script is working
//var map = L.map('map').setView([0, 0], 1);
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ugSsTpSKsBhYGaLFahMW', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);

/*
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 5,
    tileSize: 512,
  zoomOffset: -1,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);
       */
  //Markers 
  
var marker = L.marker([51.5, -0.09]).addTo(map);
var marker = L.marker([36.727352, 3.409949]).addTo(map);

