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

  function createDate(dt, type) {
    var day = new Date(dt * 1000);
    if (type == "long") {
        let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return day.toLocaleString("en-us", options); // Friday, January 15, 2021
    } else {
        return day.toLocaleString("en-us", { weekday: "long" }); // Friday
    }
}


$(document).ready(function () {
  var border;
  var markers, markers2;
  var lat;
  var lng;
  
   //       ***************   pick up current location   ***********

   navigator.geolocation.getCurrentPosition(position => {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log(lat);console.log(lng);
    //var marker = L.marker([lat, lng]).addTo(map);
    //alert("87877777777777777777999999999999999999999999");
    // get country of current lat long  location
    $.ajax({
        url: 'libs/php/getReversGeo.php',
        type: 'POST',
        dataType: 'json',
        data: { "lat": lat, "lng": lng},
        success: function(result) {

            //console.log(JSON.stringify(result));
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
                       $('#countryName').val(result['data'][0]['countryName']);

                       $('#txtNameHeader').html(result['data'][0]['countryName']);
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
            
           //************************************************************************** */
             //  get more information
            $.ajax({
               url: 'libs/php/getCountryMoreInfo.php',
               type: 'POST',
               dataType: 'json',
               data: {"country": codeCountry,
               "lang": 'en'},
               success: result4 => {
                  if (result4['status']['name'] == "ok") {
                       $('#txtCallCode').html(result4['data'][0]['callingCodes']);
                       var curr = "<br>" + result4['data'][0]['currencies'][0]['name'] + "<br>" + result4['data'][0]['currencies'][0]['code'] +
                           "<br>" + result4['data'][0]['currencies'][0]['symbol'] ;
                       $('#currency').html(curr);
                         var text = "<br>";
                       for (let i = 0; i < result4['data'][0]['borders'].length; i++) {
                       text += result4['data'][0]['borders'][i] + "<br>";
                       $('#txtBorders').html(text);
                          }
                    $('#flag').attr("src", result4['data'][0]['flags']['png']);

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
                    //console.log(JSON.stringify(result2));  
                    if (result2['status']['name'] == "ok") {
                   //L.geoJSON(geojsonFeature).addTo(map);
                       var myStyle = {
                          "color": "#ff7800",
                          "weight": 5,
                          "opacity": 0.65
                        };

                        if (border) {
                            border.remove()  
                        }
                        border = L.geoJSON(result2['data'], {
                            style: myStyle
                            }).addTo(map);
                        map.fitBounds(border.getBounds(), { padding : [50,50]});       
                    }
                }
           })
           
           
//*********************************** */
   //     Marker Cluster     ****
   //************************************ */
   const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };
    $.ajax({
        url: 'libs/php/getCountryPlaceIntrest.php',
        type: 'GET',
        dataType: 'json',
        data: { "country": codeCountry},
        
        success: result => {
           console.log(codeCountry);
          console.log(" i got data back from triposo IPA to do markers cluster");  
           if (result['status']['name'] == "ok") {
            //console.log(" i get markers cluster");  
           var markers = L.markerClusterGroup();

           for (let i = 0; i < result['data'].length; i++) {
            //console.log(result['data'][i]['coordinates']['latitude']);
             var namePlace = result['data'][i]['name'];
           var marker = L.marker(new L.LatLng(result['data'][i]['coordinates']['latitude'], result['data'][i]['coordinates']['longitude']), {
                  title: namePlace
                                  });
           marker.bindPopup("<p>" + result['data'][i]['name'] + "</p> " + "<p>" + result['data'][i]['snippet'] + "<p/>");
           markers.addLayer(marker);
          }   
           map.addLayer(markers);
           }}
   })

           /********* marker clusters countries places of intrest     sightseeing */
   /******************                                   */

   $.ajax({
    url: 'libs/php/getCountrySightseeing.php',
    type: 'GET',
    dataType: 'json',
    data: { "country":  codeCountry},
    
    success: result => {
       console.log($('#sel').val());
      console.log(" Sightseeing i got data back from triposo IPA to do markers cluster");  
       if (result['status']['name'] == "ok") {
        //console.log(" Sightseeing i get markers cluster");
        if (markers2 && map.hasLayer(markers2)) {
          console.log(" i  333333333 Sightseeing");
          map.removeLayer(markers2);
        }
      
        //markers.clearLayers();  
        markers2 = L.markerClusterGroup();
       
        for (let j = 0; j < result['data'].length; j++) {
      
          var namePlace2 = result['data'][j]['name'];
        var marker2 = L.marker(new L.LatLng(result['data'][j]['coordinates']['latitude'], result['data'][j]['coordinates']['longitude']), {
               title: namePlace2
                               });
                               
        marker2.bindPopup("<p>" + result['data'][j]['name'] + "</p> " + "<p>" + result['data'][j]['tag_labels'][0] + "<p/>");
        markers2.addLayer(marker2);
       }   

        map.addLayer(markers2);
       }}
})
/***end place of intrest sightseeing*/

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
           $('#sel').append('<option value="' + result['data'][i]['isoCode'] + '">' +result['data'][i]['countryName'] + '</option>');
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
               $('#txtNameHeader').html(result['data'][0]['countryName']);
               $('#txtName').html(result['data'][0]['countryName']);
               $('#txtContinent').html(result['data'][0]['continent']);
               $('#txtCapital').html(result['data'][0]['capital']);
               $('#txtLanguages').html(result['data'][0]['languages']);
               $('#txtPopulation').html(result['data'][0]['population']);
               $('#txtArea').html(result['data'][0]['areaInSqKm']);
              
           }
        }
   })

   //  get more information
   $.ajax({
    url: 'libs/php/getCountryMoreInfo.php',
    type: 'POST',
    dataType: 'json',
    data: {"country": $('#sel').val(),
    "lang": 'en'},
    success: result4 => {
       //console.log(JSON.stringify(result));
      
       if (result4['status']['name'] == "ok") {
           //alert(" more info");
           //console.log(" more info insid if ");
         
        $('#txtCallCode').html(result4['data'][0]['callingCodes']);
        $('#lat').html(result4['data'][0]['latlng'][0]);  
        latC = result4['data'][0]['latlng'][0];
        $('#long').html(result4['data'][0]['latlng'][1]);  
        lngC = result4['data'][0]['latlng'][1];

        var curr = "<br>" + result4['data'][0]['currencies'][0]['name'] + "<br>" + result4['data'][0]['currencies'][0]['code'] +
        "<br>" + result4['data'][0]['currencies'][0]['symbol'] ;
        $('#currency').html(curr);
        var text = "<br>";
        for (let i = 0; i < result4['data'][0]['borders'].length; i++) {
          text += result4['data'][0]['borders'][i] + "<br>";
            $('#txtBorders').html(text);
        }
        $( '#flag').empty();
        $('#flag').attr("src", result4['data'][0]['flags']['png']);

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
           //console.log(JSON.stringify(result2));
           console.log(" i am going to draw borders");
           if (result2['status']['name'] == "ok") {
            //L.geoJSON(geojsonFeature).addTo(map);
            var myStyle = {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 0.65
            };
            //console.log(border);
            if(border){

                border.remove();
                border = L.geoJSON(result2['data'], {
                    style: myStyle
                   }).addTo(map);

              map.fitBounds(border.getBounds(), { padding : [50,50]});   
                
            } 
           }
        }
   })

   

//*********************************** */
   //     Marker Cluster
   //************************************ */
   const geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  };
    $.ajax({
        url: 'libs/php/getCountryPlaceIntrest.php',
        type: 'GET',
        dataType: 'json',
        data: { "country": $('#sel').val()},
        
        success: result => {
           console.log($('#sel').val());
          console.log(" i got data back from triposo IPA to do markers cluster");  
           if (result['status']['name'] == "ok") {
            //console.log(" i get markers cluster");
            if (markers && map.hasLayer(markers)) {
              console.log(" i   3333333  PlaceIntrest");
              map.removeLayer(markers);
            }
          
            //markers.clearLayers();  
            markers = L.markerClusterGroup();
           
           for (let i = 0; i < result['data'].length; i++) {
            //console.log(result['data'][i]['coordinates']['latitude']);
      
             var namePlace = result['data'][i]['name'];
           var marker = L.marker(new L.LatLng(result['data'][i]['coordinates']['latitude'], result['data'][i]['coordinates']['longitude']), {
                  title: namePlace
                                  });
           marker.bindPopup("<p>" + result['data'][i]['name'] + "</p> " + "<p>" + result['data'][i]['snippet'] + "<p/>");
           markers.addLayer(marker);
          }   
           map.addLayer(markers);
           }}
   })

   /********* marker clusters countries places of intrest     sightseeing */
   /******************                                   */

   $.ajax({
    url: 'libs/php/getCountrySightseeing.php',
    type: 'GET',
    dataType: 'json',
    data: { "country": $('#sel').val()},
    
    success: result => {
       console.log($('#sel').val());
      console.log(" Sightseeing i got data back from triposo IPA to do markers cluster");  
       if (result['status']['name'] == "ok") {
        //console.log(" Sightseeing i get markers cluster");
        if (markers2 && map.hasLayer(markers2)) {
          console.log(" i  333333333 Sightseeing");
          map.removeLayer(markers2);
        }
      
        //markers.clearLayers();  
        markers2 = L.markerClusterGroup();
       
        for (let j = 0; j < result['data'].length; j++) {
      
          var namePlace2 = result['data'][j]['name'];
        var marker2 = L.marker(new L.LatLng(result['data'][j]['coordinates']['latitude'], result['data'][j]['coordinates']['longitude']), {
               title: namePlace2
                               });
                               
        marker2.bindPopup("<p>" + result['data'][j]['name'] + "</p> " + "<p>" + result['data'][j]['tag_labels'][0] + "<p/>");
        markers2.addLayer(marker2);
       }   

        map.addLayer(markers2);
       }}
})
/***end place of intrest sightseeing*/
   
});

//********************************************************* */
//      Weather
//********************************************************* */
$('#myBtnWeather').click(function() {
  
    $.ajax({
        url: 'libs/php/getWeather.php',
        type: 'POST',
        dataType: 'json',
        data: {"lat":  $('#lat').text(),
        "lon":  $('#long').text()},
        success: result7 => {
           //console.log(JSON.stringify(result));
           console.log(" i am in weather ajax");console.log( $('#lat').text());console.log( $('#lon').text());
           console.log("bbbbb");console.log(lat);console.log(lng);
           if (result7['status']['name'] == "ok") {
    
                 //Getting the min and max values for each day
                for(i = 0; i<7; i++){
            
                    $('#day'+ (i+1) + 'Min').html( Number(result7['data'].list[i].main.temp_min - 273.15).toFixed(1)+ '°');
                    $('#day'+ (i+1) + 'Max').html( Number(result7['data'].list[i].main.temp_max - 273.15).toFixed(1)+ '°');
            
                    $('#img'+ (i+1) ).attr("src", "http://openweathermap.org/img/wn/"+ result7['data'].list[i].weather[0].icon + '.png');
                    $('#day'+ (i+1) + 'Des').html( result7['data'].list[i].weather[0].main +'<br>'
                     + result7['data'].list[i].weather[0].description);
                    
                     $('#day'+ (i+1)).html(createDate(result7['data'].list[i].dt, "long") );
                     
                     //var day = new Date(result7['data'].list[i].dt*1000);
                     //$('#day'+ (i+1)).html(day.toDateString());  // 'Fri Jan 15 2021'
    
                } 
           }
        }
    })
})

//*********************************************************** */

//********************************************************* */
//      Wikipedia
//********************************************************* */
$('#myBtnWiki').click(function() {
    console.log("wwwwwwwiiiiiiiiiiiiiiikkkkiiiiiiiiiiii");
    var name2 = $('#txtName').text();
    console.log(name2);
    $.ajax({
        url: "libs/php/wiki.php",
        type: 'GET',
        dataType: 'json',
        data: {
          place: $('#txtName').text()
        }, 
        success: function(result) {                  
           console.log('wiki info', result);      
             if (result.status.name == "ok") {
               $('#txtWikiImg').html('<img src=' + result.data.thumbnail.source +'><br>');
               $('#txtWiki').html('Wikipedia: ' + result.data.extract +'<br>');
             } 
          },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                      }
                  });
})

//******Click country information button
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//  ***   END country information button


//******Click country Weather button
// Get the modal
var modalWeather = document.getElementById("myModalWeather");

// Get the button that opens the modal
var btnWeather = document.getElementById("myBtnWeather");

// Get the <span> element that closes the modal
var spanWeather = document.getElementsByClassName("closeWeather")[0];

// When the user clicks the button, open the modal 
btnWeather.onclick = function() {
  modalWeather.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanWeather.onclick = function() {
  modalWeather.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalWeather) {
    modalWeather.style.display = "none";
  }
}

//  ***   END country Weather button

//******Click country Wikipedia button

// Get the modal
var modalWiki = document.getElementById("myModalWiki");

// Get the button that opens the modal
var btnWiki = document.getElementById("myBtnWiki");

// Get the <span> element that closes the modal
var spanWiki = document.getElementsByClassName("closeWiki")[0];

// When the user clicks the button, open the modal 
btnWiki.onclick = function() {
  modalWiki.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanWiki.onclick = function() {
  modalWiki.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalWiki) {
    modalwiki.style.display = "none";
  }
}
 
}); // end of $(document).ready(function ()/

             