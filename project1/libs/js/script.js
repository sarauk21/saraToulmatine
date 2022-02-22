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

  //  ******          NavBar Menue EasyButtons      ********

  var buttons = []; // NOTE: use a separate array to collect the buttons
  var fileTime = [{title :'Information', icons:'fa-thin fa-info'},{title :'Wiki' , icons:'fa fa-wikipedia-w'},{title :'Weather' ,icons:'fa fa-cloud'}];
  for (var i = 0; i < fileTime.length; i++) {
    (function() {
      var time = String(fileTime[i]['title']);
      var icon1 = String(fileTime[i]['icons']);
      var mybutton = L.easyButton({
        id: time,
        states: [{
          icon: icon1 ,
          onClick: function(e) {
            //alert(time)
            if (time == 'Information') {
            // When the user clicks the button, open the modal 
            var myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.show();
            //modal.style.display = "block";
          } else if (time == 'Wiki' ) {
            // When the user clicks the button, open the modal 
            var myModal = new bootstrap.Modal(document.getElementById("myModalWiki"));
            myModal.show();
           // modalWiki.style.display = "block";
          } else if (time == 'Weather' ) {   
            // When the user clicks the button, open the modal 
            var myModal = new bootstrap.Modal(document.getElementById("myModalWeather"));
            myModal.show();
          } else { } 
          },
          title: time
        }]
      });
      buttons.push(mybutton) // NOTE: add to the buttons array instead of the map
    })();
  }
  
  var bar = L.easyBar(buttons, {
    id: 'myeasybar'
  }); // NOTE: create an easyBar 
  bar.addTo(map); // NOTE: add the bar to the map
  
  //  ******        END   NavBar Menue EasyButtons      ********

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
  var codeCountry;
  var markers, markers2, markers3;
  var lat;
  var lng;

  //  Preloding script

document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
    console.log("loaging");
      document.querySelector(
        "body").style.visibility = "hidden";
      document.querySelector(
        "#loader").style.visibility = "visible";
  } else {
    console.log("Ready");
      document.querySelector(
        "#loader").style.display = "none";
      document.querySelector(
        "body").style.visibility = "visible";
  }
};
  
   //       ***************   pick up current location   ***********

   navigator.geolocation.getCurrentPosition(position => {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log(lat);console.log(lng);

    // get country of current lat long  location

    $.ajax({
        url: 'libs/php/getReversGeo.php',
        type: 'POST',
        dataType: 'json',
        data: { "lat": lat, "lng": lng},
        success: function(result) {
            if (result.status.name == "ok") {
                //alert(" getReversGeo stat ok js"); 
            $('#txtName').html(result['data']['countryName']);
           
           var codeCountry = result['data']['countryCode'];
            //alert(codeCountry);
            console.log("==========================");
            console.log(codeCountry);
            $('#sel').val(codeCountry).change();
            console.log("==========================");
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
                       $('#countryIsoCode').val(result['data'][0]['countryCode']);
                       $('#txtNameHeader').html(result['data'][0]['countryName']);
                       $('#txtNameCountry').html(result['data'][0]['countryName']);
                      
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
          console.log(" places of intrest i got data back from triposo IPA to do markers cluster");  
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

           /********* marker clusters countries     sightseeing */
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

           /********* marker clusters countries Cities */
   /******************                                   */

   $.ajax({
    url: 'libs/php/getCountryCities.php',
    type: 'GET',
    dataType: 'json',
    data: { "country":  codeCountry},
    
    success: result => {
       console.log($('#sel').val());
      console.log(" cities i got data back from triposo IPA to do markers cluster");  
       if (result['status']['name'] == "ok") {
        //console.log(" Sightseeing i get markers cluster");
        if (markers3 && map.hasLayer(markers3)) {
          console.log(" i  333333333 Cities");
          map.removeLayer(markers3);
        }
      
        //markers.clearLayers();  
        markers3 = L.markerClusterGroup();
       
        for (let k = 0; k < result['data'].length; k++) {
      
        var namePlace3 = result['data'][k]['name'];
        var marker3 = L.marker(new L.LatLng(result['data'][k]['coordinates']['latitude'], result['data'][k]['coordinates']['longitude']), {
               title: namePlace3
                               });
                               
        marker3.bindPopup("<p>" + result['data'][k]['name'] + "</p> " + "<p>" + result['data'][k]['snippet'][0] + "<p/>");
        markers3.addLayer(marker3);
       }   

        map.addLayer(markers3);
       }}
})
/***end place of intrest Cities    */

            }  // end if 

        }
    })
     // get country info    

}) //end navigator

      //       ***************   Drop down  list of country   ***********
      var adds = $('#countryIsoCode').val();
$.ajax({
    url: 'libs/php/getCountryList.php',
    type: 'POST',
    dataType: 'json',
    data: { },
    success: result => {
       //console.log(JSON.stringify(result));
       //console.log(" i am in geonam f");
     
        if (result['status']['name'] == "ok") {
          for (let i = 0; i < result['data'].length; i++) {
          
           $('#sel').append('<option value="' + result['data'][i]['isoCode'] + '">' + result['data'][i]['countryName'] + '</option>');
        
          } //for end
          
        }
    }
})
/*   **************************************************************/

/**  ************************************************************ */

// SHOW SELECTED VALUE.
$('#sel').change(function () {

    region = $(this).val();
/***  *************************************************** */
$.ajax({
  url: 'libs/php/getCountryLatLng.php',
  type: 'post',
  dataType: 'json',
  data: { "country": region},
  success: result => {
    if (result['status']['name'] == "ok") {
      console.log(" i got lat lng of selected country");
      latitude = result['data']['lat'];
      Lngtitude = result['data']['lng'];
      console.log(latitude);
      console.log(Lngtitude);

//********************************************************* */
//      Weather
//********************************************************* */
//$('#myBtnWeather').click(function() {
  
    $.ajax({
      url: 'libs/php/getWeather.php',
      type: 'POST',
      dataType: 'json',
      data: {"lat":  latitude,
      "lon":  Lngtitude},
      success: result7 => {
         //console.log(JSON.stringify(result));
         if (result7['status']['name'] == "ok") {
          console.log(" i get weather ");
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

    }

  }
})

/*      ********************************************** */
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
               $('#txtNameCountry').html(result['data'][0]['countryName']);
               $('#txtName').html(result['data'][0]['countryName']);
               $('#txtContinent').html(result['data'][0]['continent']);
               $('#txtCapital').html(result['data'][0]['capital']);
               $('#txtLanguages').html(result['data'][0]['languages']);
               $('#txtPopulation').html(result['data'][0]['population']);
               $('#txtArea').html(result['data'][0]['areaInSqKm']);
              
               //********************************************************* */
//      Wikipedia
//********************************************************* */
//$('#myBtnWiki').click(function() {
    console.log("wwwwwwwiiiiiiiiiiiiiiikkkkiiiiiiiiiiii");
    var name2 = $('#txtName').text();
    console.log(name2);
    $.ajax({
        url: "libs/php/wiki.php",
        type: 'GET',
        dataType: 'json',
        data: {
          place: result['data'][0]['countryName']
        }, 
        success: function(result) {                  
           console.log('wiki info geo', result);      
             if (result.status.name == "ok") {
               $('#txtWikiImg').html('<img src=' + result['data'][0]['thumbnailImg'] +'><br>');
               $('#txtWiki').html('Wikipedia: ' + result['data'][0]['summary'] +'<br>');
               $('#txtRank').html('Rank: ' + result['data'][0]['rank'] +'<br>');
               $('#txtUrl').html('<a href= ' + ("https://") + result['data'][0]['wikipediaUrl'] +' target= _blank> Click it  </a><br>');
             } 
          },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                      }
                  });
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


           /********* marker clusters countries Cities */
   /******************                                   */

   $.ajax({
    url: 'libs/php/getCountryCities.php',
    type: 'GET',
    dataType: 'json',
    data: { "country":  $('#sel').val()},
    
    success: result => {
       console.log($('#sel').val());
      console.log(" cities i got data back from triposo IPA to do markers cluster");  
       if (result['status']['name'] == "ok") {
        //console.log(" Sightseeing i get markers cluster");
        if (markers3 && map.hasLayer(markers3)) {
          console.log(" i  333333333 Cities");
          map.removeLayer(markers3);
        }
        //markers.clearLayers();  
        markers3 = L.markerClusterGroup();
       
        for (let k = 0; k < result['data'].length; k++) {
      
        var namePlace3 = result['data'][k]['name'];
        var marker3 = L.marker(new L.LatLng(result['data'][k]['coordinates']['latitude'], result['data'][k]['coordinates']['longitude']), {
               title: namePlace3
                               });
                               
        marker3.bindPopup("<p>" + result['data'][k]['name'] + "</p> " + "<p>" + result['data'][k]['snippet'][0] + "<p/>");
        markers3.addLayer(marker3);
       }   

        map.addLayer(markers3);
       }}
})
/***end place of intrest Cities    */

//})

//*********************************************************** */


//})

});  // on change select list if country

//  ***   END country information button

 
}); // end of $(document).ready(function ()/

             