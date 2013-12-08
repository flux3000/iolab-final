<?php
	include_once 'simple_html_dom.php';
	require_once 'constants.php';
	
	$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
	if($mysqli->connect_errno){printf("Connect failed: %s\n", $mysqli->connect_error);exit();}
	
	//$html = file_get_html('http://www.nuforc.org/webreports/ndxevent.html');
	$html = ""; //removed for safety reasons, only run this script once!
	
	// Find all images
	foreach($html->find('table') as $main){ //find the main table
		$links = $main->find('a'); //get all the links to the subpages
		for ($i = 3; $i < sizeof($links)-1; $i++){ //loop through them (and ignore the last one which has NO DATE
		//for ($i = 0; $i < 1; $i++){
			$link = $links[$i]->href;
			$subpage = getRowsOfSubpage('http://www.nuforc.org/webreports/'.$link);	
		}
	}
	
	function getRowsOfSubpage($link){
		$subpage = file_get_html($link); //get content of subpage
		if(!$subpage){
				echo 'ERROR: link' . $link . '<br/>'; //the page is too big for the parser, you have to parse it manually
		}
		else{
			foreach($subpage->find('table') as $main){ //find the main table
				$rows = $main->find('tr'); //get all the rows holding the reports
				for ($i = 1; $i < sizeof($rows); $i++){ //loop through them (Ignore the first element
				//for ($i = 1; $i < 2; $i++){ //ignore the first element
					getContentOfRow($rows[$i]);
				}
			}
		}
	}
	
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
		
		echo "date: " . $date . '<br/>';
		
		$stmt = $mysqli->prepare("INSERT INTO ufos (date, url, city, state, shape, duration, summary, post_date) VALUES (?,?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssssss", $date, $link, $city, $state, $shape, $duration, $summary, $post_date);
		$stmt->execute();
		
	}
?>