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
        // echo $result;
	curl_close($ch);
	$decode = json_decode($result,true);	
	return $decode['results'][0]['geometry'] ;
}

$SelectLatLng = geocoding($_REQUEST['country']);
//$SelectLatLng = geocoding('GB');

//echo $SelectLatLng['lat'];
//echo $SelectLatLng['lng'];
//die($SelectLatLng['lat']);

//echo $_REQUEST['lat'];
//echo  $_REQUEST['lon'];
	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $SelectLatLng;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
