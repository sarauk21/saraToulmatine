//alert("  hi   i am in script file");
// initialize the map
var map = L.map('map').setView([42.35, -71.08], 13);

//var map = L.map('map').setView([51.505, -0.09], 13);

// load a tile layer

/*
L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
  {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 17,
    minZoom: 9
  }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 17,
    minZoom: 9
  }).addTo(map);

*/

  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ugSsTpSKsBhYGaLFahMW', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    tileSize: 512,
    zoomOffset: -1,
   }).addTo(map);


  //var marker = L.marker([51.5, -0.09]).addTo(map);


  //       ***************   Drop down  list of country   ***********
/*
  $(document).ready(function () {
    
        //var url = "libs/js/sample.json";
        var url = "libs/js/countryBorders.geo.json";

        $.getJSON(url, function (data) {
            $.each(data, function (index, value) {
                // APPEND OR INSERT DATA TO SELECT ELEMENT.
                $('#sel').append('<option value="' + value.properties.iso_a2 + '">' + value.properties.name + '</option>');
            });
        });
    

    // SHOW SELECTED VALUE.
    $('#sel').change(function () {
        $('#msg').text('Selected Item: ' + this.options[this.selectedIndex].text);
    });
});
*/
   //    ********                      *******************

   $(document).ready(function () {
   
        //var url = "libs/js/sample.json";
        var url = "libs/js/countryBorders.geo.json";

        $.getJSON(url, function (data) {
            $.each(data, function (index, value) {
                // APPEND OR INSERT DATA TO SELECT ELEMENT.
                $('#sel').append('<li><a href="#" class="dropdown-item" id="getCountry" >' + value.properties.name  + value.properties.iso_a2 +'</a></li>');
               
            });
        });
     //  ***********************     *

     $('#getCountry').click(function(e){
        e.preventDefault();
         alert("get country details");
   //geonames();
     });


   //       ***************   Drop down  list of country   ***********

   //       ***************   pick up current location   ***********

   navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    geonames("GB");
    //console.log(lat);console.log(lng);
    var marker = L.marker([lat, lng]).addTo(map);
    $.ajax({
        url: 'libs/php/reverseGeo2.php',
        type: 'POST',
        dataType: 'json',
        data: { lat1: 47.03, lng1: 10.2},
        success: response => {
         // alert("87877777777777777777");
            let name = JSON.stringify(response)  
            console.log(" i am in geo loca 55555555555555555555"); 
            console.log(lat);
            console.log(response['country_ISO3']); 
            //geonames(response['country_ISO3']);
            geonames("GB");
        }
    })
})    

const geonames = (myCountry) => {
   
    $.ajax({
         url: 'libs/php/getCountryInfo.php',
         type: 'POST',
         dataType: 'json',
         data: {countryName: myCountry},
         success: result => {
            console.log(JSON.stringify(result));
            console.log(" i am in geonam f");
            if (result['status']['name'] == "ok") {

                $('#txttxtName').html(result['data'][0]['ountryName']);
                $('#txtContinent').html(result['data'][0]['continent']);
                $('#txtCapital').html(result['data'][0]['capital']);
                $('#txtLanguages').html(result['data'][0]['languages']);
                $('#txtPopulation').html(result['data'][0]['population']);
                $('#txtArea').html(result['data'][0]['areaInSqKm']);
            }
         }
    })
}
 
}); // end of $(document).ready(function ()/

             