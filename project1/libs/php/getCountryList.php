<?php

	// remove for production
//die("in country list  mmmmmmmmmmmmm");
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $strJsonFileContents = file_get_contents("../js/countryBorders.geo.json");

    $data = json_decode($strJsonFileContents, true);
    //var_dump($data); // print array
    //print_r($data);
    //echo $data;
    //echo "*******************";
	
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $data;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
