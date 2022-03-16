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
	$url='https://www.triposo.com/api/20220104/local_highlights.json?latitude='. $SelectLatLng['lat'].'&longitude='. $SelectLatLng['lng'].'&fields=poi:id,name,images,coordinates,snippet&max_distance=10000&account=X1KEJG95&token=107v9asrs2wvte1bm4hjtc0qjaum9vpz';
// airport categorie = 4bf58dd8d48988d1ed931735
//echo $url;
    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	$result=curl_exec($ch);
  //echo $result;
	curl_close($ch);
	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['results'][0]['pois'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
