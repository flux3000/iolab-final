<?php 
//Other interesting data:
//SELECT `date`, COUNT(`date`) FROM `ufos` GROUP BY MONTH(`date`)
//SELECT `date`, COUNT(`date`) FROM `ufos` GROUP BY YEAR(`date`)

$mysqli = new mysqli("localhost", "root", "", "iolab_ass5");
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

$stmt = $mysqli->prepare("SELECT DATE_FORMAT(`date`, '%Y %m') AS DATUM, COUNT(*) AS SIGHTINGS FROM `ufos` GROUP BY DATE_FORMAT(`date`, '%Y %m')");
$stmt->execute();
$stmt->bind_result($date, $sightings);

$year = "-1";
$res = '[';
while ($stmt->fetch()) {
	$date = explode(" ", $date);
	$elYear = $date[0];
	$elMonth = $date[1];
	
	if($year == "-1"){ //starting to build json, dont append stuff
		$res .= '{"year":"' . $elYear . '", "months":[{ "month":"' . $elMonth . '", "sightings":"' . $sightings . '"';
		$year = $elYear;
	}
	elseif($elYear != $year){ //a new year
		$res .= '}]},{"year":"' . $elYear . '", "months":[{ "month":"' . $elMonth . '", "sightings":"' . $sightings . '"';
		$year = $elYear;
	}
	else{ //a extra month in the same year
		$res .= '}, {"month":"' . $elMonth . '", "sightings":"' . $sightings . '"';
	}
}
$res .= '}]}]';

echo $res;
?>