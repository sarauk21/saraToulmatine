// browser location starts when this function is called 
function getLocation() { 

  // check to make sure geolocation is possible
  if (navigator.geolocation) { 
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  } else { 
    console.log('Geolocation is not supported'; } 
  } 
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function success(pos) {

  var query = pos.coords.latitude + ',' + pos.coords.longitude;
  console.log('coordinates: ' + query);
  console.log('accuracy: ' + pos.coords.accuracy + ' meters.');

  // now we have coordinates, it is time to use them to  
  // do some reverse geocoding to get back the location information
  var api_url = 'https://api.opencagedata.com/geocode/v1/json'
  var apikey = 'YOUR-API-KEY';

  var request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(query)
    + '&pretty=1'
    + '&no_annotations=1';

  // now we follow the steps in the OpenCage javascript tutorial 
  // full example:
  // https://opencagedata.com/tutorials/geocode-in-javascript

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){  // Success!
      var data = JSON.parse(request.responseText);
      alert(data.results[0].formatted);

    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                         
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };
  request.send();  // make the request
}

// trigger getLocation when the page is ready
// change to be when a certain button is clicked or action is taken
$(document).ready(function(){
    getLocation();
}
