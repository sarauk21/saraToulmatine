<?php
  //die("************");
	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	//$url='http://api.geonames.org/postalCodeLookupJSON?postalcode=' . $_REQUEST['pc'] . '&country=' . $_REQUEST['country'] . '&username=flightltd&style=full';
	//die("************");
	$url='http://api.geonames.org/postalCodeLookupJSON?postalcode=' . $_REQUEST['pc'] . '&country=' . $_REQUEST['country'] . '&username=saraapi';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	//echo"11111111111111111111111111111111111";
	//echo $result; 
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
