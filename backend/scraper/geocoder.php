<?php
//username sliaheac@wegwerfemail.de
//passw sliaheac@wegwerfemail.de
//api key Fmjtd%7Cluubn16rn0%2Crl%3Do5-90asl0 

require_once '../constants.php';
$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

//statement: 1. group sightings by city, 2. find all the citites that are not represented in the city table
$stmt = $mysqli->prepare("SELECT ufoCities.city, ufoCities.state FROM ( SELECT * FROM ufos GROUP BY city ) AS ufoCities LEFT OUTER JOIN cities ON ufoCities.city = cities.name WHERE cities.lat IS NULL ");
$stmt->execute();
$stmt->bind_result($cityR, $stateR);

$stateStr = "";
$count = 1;
$cityArray = [];
$allCities = [];

while ($stmt->fetch()) {
	if($count <= 100){
		$count++;
		$city = preg_replace('/[^a-zA-Z0-9.]/',"+",$cityR);
		$state = preg_replace('/[^a-zA-Z0-9.]/',"+",$stateR);
		
		$stateStr .= "&location=" . $city . "," . $state;
		array_push($allCities,$cityR);
	}
	else{
		array_push($cityArray, $stateStr); //100 cities, resetting counter + add to cityArray
		$stateStr = "";
		$count = 1;
	}
}

//look up all cities and save their geocode in the database. take 100 searches at a time from the prepared array.
for($u = 0; $u < count($cityArray)-1; $u++){

	$key = "Fmjtd%7Cluubn1u7l1%2Cbw%3Do5-90bnlw";
	$url = "http://www.mapquestapi.com/geocoding/v1/batch?key=".$key.$cityArray[$u]."&thumbMaps=false&maxResults=1&outFormat=csv";
	
	$res = file_get_contents($url);
	
	$cityCounter = 0;
 	$resA = explode(",", $res);
 	for ( $i = 0; $i < sizeof($resA); $i++){
 		if($i % 15 == 0){ //country e.g. "Country"|"DisplayLng" "US"|"-122.329437" "US"|"-112.075768" "US"|"
 			if($i != 0 && $i < 1501){
 				$city = trim($resA[$i + 3], '"'); //remove trailing "
 				$lat = trim($resA[$i + 6], '"');
 				$lng = trim($resA[$i + 7], '"');
	
  				$stmt = $mysqli->prepare("INSERT INTO cities (name, lat, lng) VALUES (?,?,?)");
  				$stmt->bind_param("sdd", $allCities[$cityCounter+$u*100], $lat, $lng);
  				$stmt->execute();
 				$cityCounter++;
 			}
 		}
 	}
}


?>