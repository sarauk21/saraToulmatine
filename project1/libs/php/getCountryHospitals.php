<?php
	// remove for production
//die("in country info  mmmmmmmmmmmmm");
//die($_REQUEST['country']);

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


function geocoding($country){

	$url='https://api.opencagedata.com/geocode/v1/json?q='. $country.'&key=d85b265402584acf90f094dd19ac6872';
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	$result=curl_exec($ch);
         //echo $result;
	curl_close($ch);
	$decode = json_decode($result,true);	
	return $decode['results'][0]['geometry'] ;
}

$SelectLatLng = geocoding($_REQUEST['country']);

echo $SelectLatLng['lat'];
echo $SelectLatLng['lng'];
//die($SelectLatLng['lat']);

//echo $_REQUEST['lat'];
//echo  $_REQUEST['lon'];

    //key = fsq3TjgjfazQXKTJ7tXIzbWVtnkCsLqpc5lmEpXAC87r1IY=
    
    //$url='https://api.foursquare.com/v2/venues/search?ll='. $_REQUEST['lat'].','. $_REQUEST['lon'].'&categoryId=4bf58dd8d48988d196941735&client_id=EZQPVW3YPS2RFMN1DY4HFDPX2QJJQFJN3BUO003SD5TNF4A3&client_secret=E2E34IRKUGT3IOUHWPQMQVD4LE15R0XDIWHRA5POA4UHZOON&limit=1&v=20190425';
   // $url='https://api.foursquare.com/v2/venues/search?ll='. $SelectLatLng['lat'].','. $SelectLatLng['lng'].'&categoryId=4bf58dd8d48988d196941735&client_id=BOCHQZ4NF0D2NNFP2HM0INIKPUESPUX3RMRDUX02MPWIYSM2&client_secret=EDNX150PKLS4SMRHWL21Q0KLBAQXYQUQV5RAZI0HZSA1IYGG&limit=50&v=20190425';
	//$url='https://api.foursquare.com/v2/venues/search?ll='. $SelectLatLng['lat'].','. $SelectLatLng['lng'].'&categoryId=4bf58dd8d48988d196941735%20&client_id=EZQPVW3YPS2RFMN1DY4HFDPX2QJJQFJN3BUO003SD5TNF4A3&client_secret=E2E34IRKUGT3IOUHWPQMQVD4LE15R0XDIWHRA5POA4UHZOON&limit=1&v=20180323';
	$url='https://www.triposo.com/api/20220104/local_highlights.json?latitude='. $SelectLatLng['lat'].'&longitude='. $SelectLatLng['lng'].'&fields=poi:id,name,coordinates,snippet';
// airport categorie = 4bf58dd8d48988d1ed931735
echo $url;
    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	$result=curl_exec($ch);
  echo $result;
	curl_close($ch);
	$decode = json_decode($result,true);	
/*
    $markerData = array();
    foreach($decode['response']['venues'] as $i => $i_value) {
            
            $markerData = $i_value['response']['venues'][$i]['location'];
    }
*/
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['results'][0]['pois'];
	
	
	header('Content-Type: application/json; charset=UTF-8');

	//echo json_encode($output); 


?>
