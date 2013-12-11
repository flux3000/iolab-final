<?php
//NB: easy way to check if there are any entries without citites:
//SQL: SELECT ufoCities.city, ufoCities.state FROM (SELECT * FROM ufos GROUP BY city) AS ufoCities LEFT OUTER JOIN cities on ufoCities.city = cities.name WHERE cities.lat IS NULL;

require_once '../constants.php';
$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

//statement: 1. group sightings by city, 2. find all the citites that are not represented in the city table
$stmt = $mysqli->prepare("SELECT ufoCities.city, ufoCities.state FROM ( SELECT * FROM ufos GROUP BY city ) AS ufoCities LEFT OUTER JOIN cities ON ufoCities.city = cities.name WHERE cities.lat IS NULL ");
$stmt->execute();
$stmt->bind_result($cityR, $stateR);

$stateStr = "";
$count = 1;
$cityArray = []; //create an array for bulk citie queries, up to 100 cities at a time
$allCities = []; //create an array for holding all cities as they are described in the db (used for joining)

while ($stmt->fetch()) {
	if($count <= 100){
		$count++;
		$city = preg_replace('/[^a-zA-Z0-9.]/',"+",$cityR); //remove weird symbols
		$state = preg_replace('/[^a-zA-Z0-9.]/',"+",$stateR); //remove weird symbols
		
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
	
	//Calling the api, keep in mind that only a few queries are allowed per day.
	$key = "Fmjtd%7Cluubn1u7l1%2Cbw%3Do5-90bnlw";
	$url = "http://www.mapquestapi.com/geocoding/v1/batch?key=".$key.$cityArray[$u]."&thumbMaps=false&maxResults=1&outFormat=csv";
	
	//Getting the data back
	$res = file_get_contents($url);
	
	$cityCounter = 0; //Used for finding the city in the $allCities array
 	$resA = explode(",", $res); //The data format is cvs, so explode it and iterate through it
 	for ( $i = 0; $i < sizeof($resA); $i++){
 		if($i % 15 == 0){ //country e.g. "Country"|"DisplayLng" "US"|"-122.329437" "US"|"-112.075768" "US"|"
 			if($i != 0 && $i < 1501){
 				$city = trim($resA[$i + 3], '"'); //remove trailing "'s
 				$lat = trim($resA[$i + 6], '"');
 				$lng = trim($resA[$i + 7], '"');
	
  				$stmt = $mysqli->prepare("INSERT INTO cities (name, lat, lng) VALUES (?,?,?)"); //Add the new city to the DB
  				$stmt->bind_param("sdd", $allCities[$cityCounter+$u*100], $lat, $lng);
  				$stmt->execute();
 				$cityCounter++;
 			}
 		}
 	}
}
echo 'done';


?>