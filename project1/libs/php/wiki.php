<?php

    $executionStartTime = microtime(true) / 1000;

    $countryName = preg_replace('/\s+/', '%20', $_REQUEST['place']);
  // $url='https://en.wikipedia.org/api/rest_v1/page/summary/'. $_REQUEST['place'];
   //https://api.geonames.org/wikipediaSearchJSON?title=United%20Kingdom&maxRows=1&username=yourusername
   $url='http://api.geonames.org/wikipediaSearchJSON?title=' . $countryName . '&maxRows=1&username=saraapi';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result,true);    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $decode['geonames'];
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

?>