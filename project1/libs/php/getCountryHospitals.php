<?php

	// remove for production
//die("in country info  mmmmmmmmmmmmm");
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
//echo $_REQUEST['lat'];
//echo  $_REQUEST['lon'];

	//$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'] . '&username=saraapi';
    //key = fsq3TjgjfazQXKTJ7tXIzbWVtnkCsLqpc5lmEpXAC87r1IY=
    
    //$url='https://api.foursquare.com/v2/venues/search?ll='. $_REQUEST['lat'].','. $_REQUEST['lon'].'&categoryId=4bf58dd8d48988d196941735&client_id=EZQPVW3YPS2RFMN1DY4HFDPX2QJJQFJN3BUO003SD5TNF4A3&client_secret=E2E34IRKUGT3IOUHWPQMQVD4LE15R0XDIWHRA5POA4UHZOON&limit=1&v=20190425';
    $url='https://api.foursquare.com/v2/venues/search?ll='. $_REQUEST['lat'].','. $_REQUEST['lon'].'&categoryId=4bf58dd8d48988d196941735&client_id=BOCHQZ4NF0D2NNFP2HM0INIKPUESPUX3RMRDUX02MPWIYSM2&client_secret=EDNX150PKLS4SMRHWL21Q0KLBAQXYQUQV5RAZI0HZSA1IYGG&limit=1&v=20190425';
	//$url='https://api.foursquare.com/v2/venues/search?ll=51.6268068,-0.2716706&categoryId=4bf58dd8d48988d196941735%20&client_id=EZQPVW3YPS2RFMN1DY4HFDPX2QJJQFJN3BUO003SD5TNF4A3&client_secret=E2E34IRKUGT3IOUHWPQMQVD4LE15R0XDIWHRA5POA4UHZOON&limit=1&v=20180628';

// airport categorie = 4bf58dd8d48988d1ed931735

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	$result=curl_exec($ch);
//echo $result;
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
	$output['data'] = $decode['response']['venues'][0]['location'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
