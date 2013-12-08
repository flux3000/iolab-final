<?php
	include_once 'simple_html_dom.php';
	require_once 'constants.php';
	
	$file = 'errors/xxx'; //enter file here
	
	$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
	if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}
	
	$html = file_get_html($file);
	
	// Find all images
	$rows = $html->find('tr'); //get all the rows holding the reports
	for ($i = 0; $i < sizeof($rows); $i++){ //loop through them
		getContentOfRow($rows[$i]);
	}
	echo "done with: " . $file;
	
	function getContentOfRow($row){
		global $mysqli;
		
		$fields = $row->find('td'); //find all fields (Date/Time|City|State|Shape|Duration|Summary|Posted)
		$date = $fields[0]->plaintext;
		$link = 'http://www.nuforc.org/webreports/' . $fields[0]->find('a')[0]->href;
		$city = $fields[1]->plaintext;
		$state = $fields[2]->plaintext;
		$shape = $fields[3]->plaintext;
		$duration = $fields[4]->plaintext;
		$summary = $fields[5]->plaintext;
		$post_date = $fields[6]->plaintext;
		
		$stmt = $mysqli->prepare("INSERT INTO ufos (date, url, city, state, shape, duration, summary, post_date) VALUES (?,?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssssss", $date, $link, $city, $state, $shape, $duration, $summary, $post_date);
		$stmt->execute();
		
	}
?>