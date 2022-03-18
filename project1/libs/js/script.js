
//alert("  hi   i am in script file");
// initialize the map
//var map = L.map('map').setView([42.35, -71.08], 13);
var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ugSsTpSKsBhYGaLFahMW', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

/********* define variable for extra marker cluster */

var redMarker = L.ExtraMarkers.icon({
  icon: 'fa-coffee',
  markerColor: 'white',
  iconColor: 'red',
  shape: 'square',
  prefix: 'fa'
});
var blueMarker = L.ExtraMarkers.icon({
  icon: 'fa-car',
  markerColor: 'cyan',
  iconColor: 'blue',
  shape: 'circle',
  prefix: 'fa'
});
var greenMarker = L.ExtraMarkers.icon({
  icon: 'fa-eye',
  markerColor: 'white',
  iconColor: 'green',
  shape: 'star',
  prefix: 'fa'
});

//  ******          NavBar Menue EasyButtons      ********

var buttons = []; // NOTE: use a separate array to collect the buttons
var fileTime = [{ title: 'Information', icons: 'fa-thin fa-info' }, { title: 'Wiki', icons: 'fa fa-wikipedia-w' }, { title: 'Weather', icons: 'fa fa-cloud' }];
for (var i = 0; i < fileTime.length; i++) {
  (function () {
    var time = String(fileTime[i]['title']);
    var icon1 = String(fileTime[i]['icons']);
    var mybutton = L.easyButton({
      id: time,
      states: [{
        icon: icon1,
        onClick: function (e) {
          //alert(time)
          if (time == 'Information') {
            // When the user clicks the button, open the modal 
            var myModal = new bootstrap.Modal(document.getElementById("myModal"));
            myModal.show();
            //modal.style.display = "block";
          } else if (time == 'Wiki') {
            // When the user clicks the button, open the modal 
            var myModal = new bootstrap.Modal(document.getElementById("myModalWiki"));
            myModal.show();
            // modalWiki.style.display = "block";
          } else if (time == 'Weather') {
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

var border;
var codeCountry;
var markers;
var lat;
var lng;

$(document).ready(function () {


  //  Preloding script

  document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
     // console.log("loaging");
      document.querySelector(
        "body").style.visibility = "hidden";
      document.querySelector(
        "#loader").style.visibility = "visible";
    } else {
      //console.log("Ready");
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
    //console.log(lat); console.log(lng);


    // get country of current lat long  location

    $.ajax({
      url: 'libs/php/getReversGeo.php',
      type: 'POST',
      dataType: 'json',
      data: { "lat": lat, "lng": lng },
      success: function (result) {
        if (result.status.name == "ok") {
          //alert(" getReversGeo stat ok js"); 
          $('#txtName').html(result['data']['countryName']);

          var codeCountry = result['data']['countryCode'];
          //alert(codeCountry);
         // console.log("==========================");
         // console.log(codeCountry);
          $('#sel').val(codeCountry).change();
          //console.log("==========================");
          $.ajax({
            url: 'libs/php/getCountryInfo.php',
            type: 'POST',
            dataType: 'json',
            data: {
              "country": codeCountry,
              "lang": 'en'
            },
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
            data: {
              "country": codeCountry,
              "lang": 'en'
            },
            success: result4 => {
              if (result4['status']['name'] == "ok") {
                $('#txtCallCode').html(result4['data'][0]['callingCodes']);
                var curr = "<br>" + result4['data'][0]['currencies'][0]['name'] + "<br>" + result4['data'][0]['currencies'][0]['code'] +
                  "<br>" + result4['data'][0]['currencies'][0]['symbol'];
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
            data: { "country": codeCountry },
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
                map.fitBounds(border.getBounds(), { padding: [50, 50] });
              }
            }
          })

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
    data: {},
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



  //  ***   END country information button


    // SHOW SELECTED VALUE.
    $('#sel').change(function () {

      region = $(this).val();
      /***  *************************************************** */
      $.ajax({
        url: 'libs/php/getCountryLatLng.php',
        type: 'post',
        dataType: 'json',
        data: { "country": region },
        success: result => {
          if (result['status']['name'] == "ok") {
            //console.log(" i got lat lng of selected country");
            latitude = result['data']['lat'];
            Lngtitude = result['data']['lng'];
            //console.log(latitude);
            //console.log(Lngtitude);
  
            //********************************************************* */
            //      Weather
            //********************************************************* */
            //$('#myBtnWeather').click(function() {
  
            $.ajax({
              url: 'libs/php/getWeather.php',
              type: 'POST',
              dataType: 'json',
              data: {
                "lat": latitude,
                "lon": Lngtitude
              },
              success: result7 => {
                //console.log(JSON.stringify(result));
                if (result7['status']['name'] == "ok") {
               
var unitIsCelcius = true;
var globalForecast = [];

// Maps the API's icons to the ones from https://erikflowers.github.io/weather-icons/
var weatherIconsMap = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-cloudy",
  "02n": "wi-night-cloudy",
  "03d": "wi-cloud",
  "03n": "wi-cloud",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-showers",
  "09n": "wi-showers",
  "10d": "wi-day-hail",
  "10n": "wi-night-hail",
  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",
  "13d": "wi-snow",
  "13n": "wi-snow",
  "50d": "wi-fog",
  "50n": "wi-fog"
};

$(function(){
  startClock();  
});


function startClock(){
  setInterval(function(){
    $("#localTime").text(new Date().toLocaleTimeString());
  }, 1000);
}


globalForecast = result7['data'];
updateForecast(result7['data']);


      // Stops Refresh button's spinning animation
      $("#refreshButton").html("<i class='fa fa-refresh fa-fw'></i> Refresh");
   



// Update view values from passed forecast
function updateForecast(forecast){

  // Present day
  var today = forecast.daily[0];
  $("#tempDescription").text(toCamelCase(today.weather[0].description));
  $("#humidity").text(today.humidity);
  $("#wind").text(today.wind_speed);
  $("#localDate").text(getFormattedDate(today.dt));
  $("#main-icon").addClass(weatherIconsMap[today.weather[0].icon]);
  $("#mainTemperature").text(Math.round(today.temp.day));
  $("#mainTempHot").text(Math.round(today.temp.max));
  $("#mainTempLow").text(Math.round(today.temp.min));


  // Following days data
  for(var i = 1; i < (forecast.daily).length; i++){
    var day = forecast.daily[i];

    // Day short format e.g. Mon
    var dayName = getFormattedDate(day.dt).substring(0,3);

    // weather icon from map
    var weatherIcon = weatherIconsMap[day.weather[0].icon];

    $("#forecast-day-" + i + "-name").text(dayName);
    $("#forecast-day-" + i + "-icon").addClass(weatherIcon);
    $("#forecast-day-" + i + "-main").text(Math.round(day.temp.day));
    $("#forecast-day-" + i + "-ht").text(Math.round(day.temp.max));
    $("#forecast-day-" + i + "-lt").text(Math.round(day.temp.min));
  }
}

// Refresh button handler
$("#refreshButton").on("click", function(){
  // Starts Refresh button's spinning animation
  $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
  getWeatherData();
});


// Celcius button handler.
// Converts every shown value to Celcius
$("#celcius").on("click", function(){
  if(!unitIsCelcius){
    $("#farenheit").removeClass("active");
    this.className = "active";

    // main day
    var today = globalForecast.list[0];
    today.temp.day = toCelcius(today.temp.day);
    today.temp.max = toCelcius(today.temp.max);
    today.temp.min = toCelcius(today.temp.min);
    globalForecast.list[0] = today;

    // week
    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toCelcius(weekDay.temp.day);
      weekDay.temp.max = toCelcius(weekDay.temp.max);
      weekDay.temp.min = toCelcius(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    // update view with updated values
    updateForecast(globalForecast);

    unitIsCelcius = true;
  }
});


// Farenheit button handler
// Converts every shown value to Farenheit
$("#farenheit").on("click", function(){  
  if(unitIsCelcius){
    $("#celcius").removeClass("active");
    this.className = "active";
    
    // main day
    var today = globalForecast.list[0];
    today.temp.day = toFerenheit(today.temp.day);
    today.temp.max = toFerenheit(today.temp.max);
    today.temp.min = toFerenheit(today.temp.min);
    globalForecast.list[0] = today;

    // week
    for(var i = 1; i < 5; i ++){
      var weekDay = globalForecast.list[i];
      weekDay.temp.day = toFerenheit(weekDay.temp.day);
      weekDay.temp.max = toFerenheit(weekDay.temp.max);
      weekDay.temp.min = toFerenheit(weekDay.temp.min);
      globalForecast[i] = weekDay;
    }

    // update view with updated values
    updateForecast(globalForecast);
    
    unitIsCelcius = false;
  }
});


// Applies the following format to date: WeekDay, Month Day, Year
function getFormattedDate(date){
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date * 1000).toLocaleDateString("en-US",options);
}


// Formats the text to CamelCase
function toCamelCase(str) {
  var arr = str.split(" ").map(
    function(sentence){
      return sentence.charAt(0).toUpperCase() + sentence.substring(1);
    }
  );
  return arr.join(" ");
}


// Converts to Celcius
function toCelcius(val){
  return Math.round((val - 32) * (5/9));
}


// Converts to Farenheit
function toFerenheit(val){
  var degrees = (val * 1.8) + 32;
  var rounded = Math.round(degrees);
  return rounded;
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
        data: {
          "country": $('#sel').val(),
          "lang": 'en'
        },
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
            //console.log("wwwwwwwiiiiiiiiiiiiiiikkkkiiiiiiiiiiii");
            var name2 = $('#txtName').text();
            //console.log(name2);
            $.ajax({
              url: "libs/php/wiki.php",
              type: 'GET',
              dataType: 'json',
              data: {
                place: result['data'][0]['countryName']
              },
              success: function (result) {
               // console.log('wiki info geo', result);
                if (result.status.name == "ok") {
                  $('#txtWikiImg').html('<img src=' + result['data'][0]['thumbnailImg'] + '><br>');
                  $('#txtWiki').html('Wikipedia: ' + result['data'][0]['summary'] + '<br>');
                  $('#txtRank').html('Rank: ' + result['data'][0]['rank'] + '<br>');
                  $('#txtUrl').html('<a href= ' + ("https://") + result['data'][0]['wikipediaUrl'] + ' target= _blank> Read more  </a><br>');
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                //console.log(textStatus, errorThrown);
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
        data: {
          "country": $('#sel').val(),
          "lang": 'en'
        },
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
              "<br>" + result4['data'][0]['currencies'][0]['symbol'];
            $('#currency').html(curr);
            var text = "<br>";
            for (let i = 0; i < result4['data'][0]['borders'].length; i++) {
              text += result4['data'][0]['borders'][i] + "<br>";
              $('#txtBorders').html(text);
            }
            $('#flag').empty();
            $('#flag').attr("src", result4['data'][0]['flags']['png']);
  
          }
        }
      })
  
      // draw border on map 
      $.ajax({
        url: 'libs/php/drawCountryBorder.php',
        type: 'POST',
        dataType: 'json',
        data: { "country": $('#sel').val() },
        success: result2 => {
          //console.log(JSON.stringify(result2));
          //console.log(" i am going to draw borders");
          if (result2['status']['name'] == "ok") {
            //L.geoJSON(geojsonFeature).addTo(map);
            var myStyle = {
              "color": "#ff7800",
              "weight": 5,
              "opacity": 0.65
            };
            //console.log(border);
            if (border) {
              border.remove();
            }
            border = L.geoJSON(result2['data'], {
              style: myStyle
            }).addTo(map);
  
            map.fitBounds(border.getBounds(), { padding: [50, 50] });
          }
        }
      })
  
      if (markers) {
        markers.clearLayers();
      }
      markers = L.markerClusterGroup();
  
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
        data: { "country": $('#sel').val() },
  
        success: result => {
         
          if (result['status']['name'] == "ok") {
            
            for (let i = 0; i < result['data'].length; i++) {
  
              var namePlace = result['data'][i]['name'];
  
  
              let marker = L.marker([result['data'][i]['coordinates']['latitude'], result['data'][i]['coordinates']['longitude']], { icon: redMarker, title: namePlace });
              marker.bindPopup("<p>" + result['data'][i]['name'] + "</p> " + "<p>" + result['data'][i]['snippet'] + "<p/>" +
              "<p><img width='160' height='100' src="+ result['data'][i]['images'][0]['sizes']['thumbnail']['url'] +"><p/>").openPopup(map);
              markers.addLayer(marker);
  
            }

            
          }
        }
      }).then(()=>{
       
            $.ajax({
              url: 'libs/php/getCountrySightseeing.php',
              type: 'GET',
              dataType: 'json',
              data: { "country": $('#sel').val() },
        
              success: result => {
                //console.log($('#sel').val());
                if (result['status']['name'] == "ok") {
                  for (let j = 0; j < result['data'].length; j++) {
        
                    var namePlace2 = result['data'][j]['name'];
        
        
                    let marker = L.marker([result['data'][j]['coordinates']['latitude'], result['data'][j]['coordinates']['longitude']], { icon: greenMarker, title: namePlace2 });
                    marker.bindPopup("<p>" + result['data'][j]['name'] + "</p> " + "<p>" + result['data'][j]['tag_labels'][0] + "<p/>" +
                     "<p>" + result['data'][j]['snippet'] + "<p/>" + 
                      "<p><img width='160' height='100' src=" + result['data'][j]['images'][0]['sizes']['thumbnail']['url'] + "><p/>").openPopup(map);
                    markers.addLayer(marker);
                    
                  }

                  
                }
              }
            }).then(()=>{
              
  
                    $.ajax({
                      url: 'libs/php/getCountryCities.php',
                      type: 'GET',
                      dataType: 'json',
                      data: { "country": $('#sel').val() },
                
                      success: result => {
                       // console.log($('#sel').val());
                       // console.log("ON CHANGE cities i got data back from triposo IPA to do markers cluster");
                        if (result['status']['name'] == "ok") {
                
                          for (let k = 0; k < result['data'].length; k++) {
                
                            var namePlace3 = result['data'][k]['name'];
                
                            let marker = L.marker([result['data'][k]['coordinates']['latitude'], result['data'][k]['coordinates']['longitude']], { icon: blueMarker, title: namePlace3 });
                            marker.bindPopup("<p>" + result['data'][k]['name'] + "</p> " + 
                            "<p>" + result['data'][k]['snippet'] + "<p/>" +  "<p><img width='160' height='100' src=" + result['data'][k]['images'][0]['sizes']['thumbnail']['url'] + "><p/>").openPopup(map);
                            markers.addLayer(marker);
                            
                          }

                          map.addLayer(markers);
                          
                        }
                      }
                    })
            })
      })
  
     
  
  
     
  
      //})
  
      //*********************************************************** */
  
  
      //})
  
    });  // on change select list if country

}); // end of $(document).ready(function ()/

