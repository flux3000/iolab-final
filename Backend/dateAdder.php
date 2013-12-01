<?php
require_once 'constants.php';
//This script is run to add dates to the db entries

$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

$stmt = $mysqli->prepare("SELECT `id`, `date`, `date_str` FROM  `ufos` WHERE  `date` = DATE(0000 -00 -00)");
$stmt->execute();
$stmt->bind_result($id, $date, $date_str);

while ($stmt->fetch()) {
	
	$rawDate = explode(" ",$date_str)[0]; //remove time from "6/30/13 23:13"
	$rawDateArray = explode("/", $rawDate);
	$day = $rawDateArray[1];
	$month = $rawDateArray[0];
	$year = $rawDateArray[2];
	
	//NB will break after year 2030 ;)
	if($year < 30){ //we are in the 2000ies
		$year = "20" . $year;
	}
	else{ //we are in the 1900ies
		$year = "19" . $year;
	}
	
	if(strlen($day) < 2){ //single digit day, append 0
		$day = "0" . $day;
	}
	if(strlen($month) < 2){ //single digit month, append 0
		$month = "0" . $month;
	}
	
	$newDate = $year . "-" . $month . "-" . $day;
	
	
	$mysqli2 = new mysqli(HOST, USER, PASSWORD, DATABASE);
	if($mysqli2->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}
	$stmt2 = $mysqli2->prepare("UPDATE ufos SET `date` = ? WHERE id = ?");
	$stmt2->bind_param("ss", $newDate, $id);
	$stmt2->execute();
	$mysqli2->close();
}
echo 'done';