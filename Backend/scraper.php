<?php
	include_once 'simple_html_dom.php';
	
	$html = file_get_html('http://www.nuforc.org/webreports/ndxevent.html');
	
	// Find all images
	foreach($html->find('table') as $main){ //find the main table
		$links = $main->find('a'); //get all the links to the subpages
		//for ($i = 0; $i < sizeof($links)-1; $i++){ //loop through them (and ignore the last one which has NO DATE
		for ($i = 0; $i < 1; $i++){
			$link = $links[$i]->href;
			$subpage = getContentOfSubpage('http://www.nuforc.org/webreports/'.$link);	
		}
	}
	
	function getContentOfSubpage($link){
		//$subpage = file_get_html('http://www.nuforc.org/webreports/'.$link); //get content of subpage
	}
?>