<?php 
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}"); //allow people to call API

require_once 'constants.php';
$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}

if(isset($_GET['id'])){
	$idIn = $_GET['id'];
	
	$stmt = $mysqli->prepare("SELECT `id`,`date`,`url`,`city`,`state`,`shape`,`duration`,`summary` FROM `ufos` WHERE id=?");
	$stmt->bind_param("i", $idIn);
	$stmt->execute();
	$stmt->bind_result($id,$date,$url,$city,$state,$shape,$duration,$summary);
	
	$stmt->fetch();
	echo '{"id":' . json_encode($id) . ',"lat":' . json_encode("37.8714319") . ',"lng":' . json_encode("-122.2584987") . ', "date":' . json_encode($date) . ', "url":' . json_encode($url) . ', "city":' . json_encode($city) . ', "state":' . json_encode($state) . ', "shape":' . json_encode($shape) . ',"duration":' . json_encode($duration) . ',"summary":' . json_encode(str_replace("&quot;", '"', $summary)) . '}';
}
elseif(isset($_GET['month'])){
	$month = $_GET['month'];
	$year = $_GET['year'];
	
	$stmt = $mysqli->prepare("SELECT `id`,`date`,`url`,`city`,`state`,`shape`,`duration`,`summary` FROM `ufos` where `date` between '" . $year . "-" . $month . "-01' and '" . $year . "-" . $month . "-31'");
	$stmt->execute();
	$stmt->bind_result($id,$date,$url,$city,$state,$shape,$duration,$summary);
	
	$res = "[";
	while($stmt->fetch()){
		$res .= '{"id":' . json_encode($id) . ',"lat":' . json_encode("37.8714319") . ',"lng":' . json_encode("-122.2584987") . ', "date":' . json_encode($date) . ', "url":' . json_encode($url) . ', "city":' . json_encode($city) . ', "state":' . json_encode($state) . ', "shape":' . json_encode($shape) . ',"duration":' . json_encode($duration) . ',"summary":' . json_encode(str_replace("&quot;", '"', $summary)) . '},';
	}
	$res = rtrim($res, ",");
	$res .= "]";
	echo $res;
}
else{
	echo "nothing set";
}
?>