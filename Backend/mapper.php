<?php 
$mysqli = new mysqli("localhost", "root", "", "iolab_ass5");
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

$stmt = $mysqli->prepare("SELECT `state`, COUNT(*) AS SIGHTINGS FROM `ufos` GROUP BY `state` ORDER BY COUNT(*) DESC");
$stmt->execute();
$stmt->bind_result($state, $sightings);

$sState = "-1";
$res = '[';
while ($stmt->fetch()) {	
	if($sState == "-1"){ //starting to build json, dont append stuff
		$res .= '{"name":' . json_encode($state) . ', "sightings":' . json_encode($sightings);
		$sState = $state;
	}
	else{ //a new year
		$res .= '},{"name":' . json_encode($state) . ', "sightings":' . json_encode($sightings);
	}
}
$res .= '}]';

echo $res;
?>