<?php
  //die("************");
	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	//$url='http://api.geonames.org/countryCode?lat='. $_REQUEST['lat1'] . '&lng=' . $_REQUEST['lng1'] . '&username=saraapi';
$url='http://api.geonames.org/countryCode?lat=47.03&lng=10.2username=saraapi';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	//echo"11111111111111111111111111111111111";
	echo $result; 
	//echo"111111111111111111111111111111111115555555555555555555555";

	curl_close($ch);

	$decode = json_decode($result,true);	

   
	//echo $decode;

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['postalcodes'];
	
	header('Content-Type: application/json; charset=UTF-8');
    
	echo json_encode($output); 

?>
