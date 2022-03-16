<?php
	// remove for production
//die("in country info  mmmmmmmmmmmmm");
//die($_REQUEST['country']);

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if ($_REQUEST['country'] == "GB") { $country2 = "uk";} else {$country2 = strtolower($_REQUEST['country']);}

$url='https://www.triposo.com/api/20220104/location.json?countrycode='.$country2.'&tag_labels=city&count=50&fields=id,name,score,snippet,images,country_id,coordinates&order_by=-score&account=X1KEJG95&token=107v9asrs2wvte1bm4hjtc0qjaum9vpz';


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
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
