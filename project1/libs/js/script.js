//alert("  hi   i am in script file");
// initialize the map
//var map = L.map('map').setView([42.35, -71.08], 13);
var map = L.map('map').setView([0, 0], 2);

  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ugSsTpSKsBhYGaLFahMW', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    tileSize: 512,
    zoomOffset: -1,
   }).addTo(map);


  //var marker = L.marker([51.5, -0.09]).addTo(map);


  //       ***************   Drop down  list of country   ***********

   //    ********                      *******************
$(document).ready(function () {

   //       ***************   pick up current location   ***********

   navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    console.log(lat);console.log(lng);
    var marker = L.marker([lat, lng]).addTo(map);
    //alert("87877777777777777777999999999999999999999999");
    // get country of current lat long  location
    $.ajax({
        url: 'libs/php/getReversGeo.php',
        type: 'POST',
        dataType: 'json',
        data: { "lat": lat, "lng": lng},
        success: function(result) {

            console.log(JSON.stringify(result));
            if (result.status.name == "ok") {
                //alert(" getReversGeo stat ok js"); 
            $('#txtName').html(result['data']['countryName']);
            codeCountry = result['data']['countryCode'];
            //alert(codeCountry);
            console.log(codeCountry);
            $.ajax({
                url: 'libs/php/getCountryInfo.php',
                type: 'POST',
                dataType: 'json',
                data: {"country": codeCountry,
                "lang": 'en'},
                success: result => {
                   //console.log(JSON.stringify(result));
                   //console.log(" i am in geonam f");
                   if (result['status']['name'] == "ok") {
        
                       $('#txtName').html(result['data'][0]['countryName']);
                       $('#txtContinent').html(result['data'][0]['continent']);
                       $('#txtCapital').html(result['data'][0]['capital']);
                       $('#txtLanguages').html(result['data'][0]['languages']);
                       $('#txtPopulation').html(result['data'][0]['population']);
                       $('#txtArea').html(result['data'][0]['areaInSqKm']);
                       $('#lat').html(lat);
                       $('#long').html(lng);
                       $('#currency').html(result['data'][0]['currencyCode']);
                   }
                }
           })

                 // draw border on map 
           $.ajax({
               url: 'libs/php/drawCountryBorder.php',
               type: 'POST',
               dataType: 'json',
               data: {"country": codeCountry},
               success: result2 => {
                    console.log(JSON.stringify(result2));  
                    if (result2['status']['name'] == "ok") {
                   //L.geoJSON(geojsonFeature).addTo(map);
                       var myStyle = {
                          "color": "#ff7800",
                          "weight": 5,
                          "opacity": 0.65
                        };
            
                       L.geoJSON(result2['data'], {
                       style: myStyle
                       }).addTo(map);
               
                    }
                }
           })

            }  // end if 

        }
    })
     // get country info
     

}) //end navigator



      //       ***************   Drop down  list of country   ***********
$.ajax({
    url: 'libs/php/getCountryList.php',
    type: 'POST',
    dataType: 'json',
    data: { },
    success: result => {
       //console.log(JSON.stringify(result));
       //console.log(" i am in geonam f");
     
        if (result['status']['name'] == "ok") {
           //alert("55555555555");
          //alert(result);
          for (let i = 0; i < result['data'].length; i++) {
           // APPEND OR INSERT DATA TO SELECT ELEMENT.
           $('#sel').append('<option value="' + result['data'][i]['properties']['iso_a2'] + '">' +result['data'][i]['properties']['name'] + '</option>');
          }

        }
    }
})

// SHOW SELECTED VALUE.
$('#sel').change(function () {
    //$('#msg').text('Selected Item: ' + this.options[this.selectedIndex].text);
    region = $(this).val();
    //alert(region);
    // get country info
    $.ajax({
        url: 'libs/php/getCountryInfo.php',
        type: 'POST',
        dataType: 'json',
        data: {"country": $('#sel').val(),
        "lang": 'en'},
        success: result => {
           //console.log(JSON.stringify(result));
           //console.log(" i am in geonam f");
           if (result['status']['name'] == "ok") {

               $('#txtName').html(result['data'][0]['countryName']);
               $('#txtContinent').html(result['data'][0]['continent']);
               $('#txtCapital').html(result['data'][0]['capital']);
               $('#txtLanguages').html(result['data'][0]['languages']);
               $('#txtPopulation').html(result['data'][0]['population']);
               $('#txtArea').html(result['data'][0]['areaInSqKm']);
               $('#currency').html(result['data'][0]['currencyCode'])
           }
        }
   })
    // draw border on map 
    $.ajax({
        url: 'libs/php/drawCountryBorder.php',
        type: 'POST',
        dataType: 'json',
        data: {"country": $('#sel').val()},
        success: result2 => {
           console.log(JSON.stringify(result2));
           console.log(" i am in geonam f");
           if (result2['status']['name'] == "ok") {
            //L.geoJSON(geojsonFeature).addTo(map);
            var myStyle = {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 0.65
            };
            
            L.geoJSON(result2['data'], {
                style: myStyle
            }).addTo(map);
               
           }
        }
   })
});
 
}); // end of $(document).ready(function ()/

             