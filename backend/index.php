<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, user-scalable=yes">
	<title>UFO-API</title>
	<link rel="stylesheet" type="text/css" href="api.css" />
	<link href='http://fonts.googleapis.com/css?family=Antic+Slab' rel='stylesheet' type='text/css'>
</head>
<body>
<main>	
	<div id="header">
		IFO-IO API
	</div>

	<div class="main">
		<div class="note">
			<h2>General information about UFO-OI API</h2>
			<div class="heading">
				All calls are sent to <code>ufoMapper.php</code> using <code>GET</code>. These calls return <code>JSON</code>.
				<br>
				The data is from the national UFO reporting center, and last updated 12/03/2013, the database holds <b>82,640 sightings</b>.
				<br>
				This API is made for class purposes, if you plan to use it in your project please contact <a href="http://www.linkedin.com/in/tomquast">me</a>.
				<br>
				<br>
			</div>
		</div>
		
		<div class="entry">
			<div class="chart-header">Get sighting by id</div>
			<div class="input">
				<h3>Parameter</h3>
				<div class="element">id, format: int e.g. <code>id=9000</code>, <span class="required">required</span></div>
			</div>
			<hr>
			<div class="input">
				<h3>Call</h3>
				<div class="example">request uri: <code>ufoMapper.php?id=9000</code></div>
				<hr>
				<h3>Output</h3>
				<div class="w"><div class="P" id="iX"><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">id</span>"</span>:<span class="number">9000</span>,</li><li><span class="property">"<span class="p">lat</span>"</span>:<span class="string">"37.8714319"</span>,</li><li><span class="property">"<span class="p">lng</span>"</span>:<span class="string">"-122.2584987"</span>,</li><li><span class="property">"<span class="p">date</span>"</span>:<span class="string">"2012-10-02"</span>,</li><li><span class="property">"<span class="p">url</span>"</span>:<span class="string">"http:\/\/www.nuforc.org\/webreports\/093\/S93270.html"</span>,</li><li><span class="property">"<span class="p">city</span>"</span>:<span class="string">"Canton"</span>,</li><li><span class="property">"<span class="p">state</span>"</span>:<span class="string">"IL"</span>,</li><li><span class="property">"<span class="p">shape</span>"</span>:<span class="string">"Oval"</span>,</li><li><span class="property">"<span class="p">duration</span>"</span>:<span class="string">"5 seconds"</span>,</li><li><span class="property">"<span class="p">summary</span>"</span>:<span class="string">"This is my second sighting near this area since 2001."</span></li></ul><span class="toggle-end">}</span></span></div></div>
			</div>
		</div>
		
		<div class="entry">
			<div class="chart-header">Get all sightings for given date</div>
			<div class="input">
				<h3>Parameters</h3>
				<div class="element">month, format: MM e.g. <code>month=01</code>, <span class="required">required</span></div>
				<div class="element">year, format: YYYY e.g. <code>year=2000</code>, <span class="required">required</span></div>
			</div>
			<hr>
			<div class="input">
				<h3>Call</h3>
				<div class="example">request uri: <code>ufoMapper.php?month=09&year=2000</code></div>
				<hr>
				<h3>Output</h3>
				<div class="w"><div class="P" id="iX"><span class="array"><span class="toggle">[</span><ol><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">id</span>"</span>:<span class="number">81985</span>,</li><li><span class="property">"<span class="p">lat</span>"</span>:<span class="string">"42.885441"</span>,</li><li><span class="property">"<span class="p">lng</span>"</span>:<span class="string">"-78.878464"</span>,</li><li><span class="property">"<span class="p">date</span>"</span>:<span class="string">"1960-09-05"</span>,</li><li><span class="property">"<span class="p">url</span>"</span>:<span class="string">"http:\/\/www.nuforc.org\/webreports\/046\/S46061.html"</span>,</li><li><span class="property">"<span class="p">city</span>"</span>:<span class="string">"Buffalo"</span>,</li><li><span class="property">"<span class="p">state</span>"</span>:<span class="string">"NY"</span>,</li><li><span class="property">"<span class="p">shape</span>"</span>:<span class="string">"Oval"</span>,</li><li><span class="property">"<span class="p">duration</span>"</span>:<span class="string">"3 minutes"</span>,</li><li><span class="property">"<span class="p">summary</span>"</span>:<span class="string">"Precise movements of a \"craft\" apparently observing a large tank like structure."</span></li></ul><span class="toggle-end">}</span>,</span></li><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">id</span>"</span>:<span class="number">81984</span>,</li><li><span class="property">"<span class="p">lat</span>"</span>:<span class="string">"0.000000"</span>,</li><li><span class="property">"<span class="p">lng</span>"</span>:<span class="string">"37.686981"</span>,</li><li><span class="property">"<span class="p">date</span>"</span>:<span class="string">"1960-09-10"</span>,</li><li><span class="property">"<span class="p">url</span>"</span>:<span class="string">"http:\/\/www.nuforc.org\/webreports\/038\/S38258.html"</span>,</li><li><span class="property">"<span class="p">city</span>"</span>:<span class="string">"Wichita"</span>,</li><li><span class="property">"<span class="p">state</span>"</span>:<span class="string">"KS"</span>,</li><li><span class="property">"<span class="p">shape</span>"</span>:<span class="string">"Oval"</span>,</li><li><span class="property">"<span class="p">duration</span>"</span>:<span class="string">"20 min."</span>,</li><li><span class="property">"<span class="p">summary</span>"</span>:<span class="string">"MADE ONY A HUMMING SOUND EVEN WHEN IT TOOK OFF."</span></li></ul><span class="toggle-end">}</span>,</span></li><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">id</span>"</span>:<span class="number">81981</span>,</li><li><span class="property">"<span class="p">lat</span>"</span>:<span class="string">"40.415661"</span>,</li><li><span class="property">"<span class="p">lng</span>"</span>:<span class="string">"-120.649719"</span>,</li><li><span class="property">"<span class="p">date</span>"</span>:<span class="string">"1960-09-15"</span>,</li><li><span class="property">"<span class="p">url</span>"</span>:<span class="string">"http:\/\/www.nuforc.org\/webreports\/036\/S36107.html"</span>,</li><li><span class="property">"<span class="p">city</span>"</span>:<span class="string">"Susanville"</span>,</li><li><span class="property">"<span class="p">state</span>"</span>:<span class="string">"CA"</span>,</li><li><span class="property">"<span class="p">shape</span>"</span>:<span class="string">"\r\n"</span>,</li><li><span class="property">"<span class="p">duration</span>"</span>:<span class="string">"5-6 minutes"</span>,</li><li><span class="property">"<span class="p">summary</span>"</span>:<span class="string">"Three craft in formation, high altitude, lights constant across sky - unlike aircraft running lights which blink and \"hide\""</span></li></ul><span class="toggle-end">}</span></span></li></ol><span class="toggle-end" card="3">]</span></span></div></div>			</div>
		</div>
		
		<div class="entry">
			<div class="chart-header">Get number of sightings by month</div>
			<div class="input">
				<h3>Parameters</h3>
				<div class="element">none, nb: call <span class="required"><code>graph.php</code></span></div>
			</div>
			<hr>
			<div class="input">
				<h3>Call</h3>
				<div class="example">request uri: <code>graph.php</code></div>
				<hr>
				<h3>Output</h3>
				<div class="w"><div class="P" id="iX"><span class="array"><span class="toggle">[</span><ol><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">year</span>"</span>:<span class="string">"1930"</span>,</li><li><span class="property">"<span class="p collapsible">months</span>"</span>:<span class="array"><span class="toggle">[</span><ol><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">month</span>"</span>:<span class="string">"06"</span>,</li><li><span class="property">"<span class="p">sightings</span>"</span>:<span class="number">2</span></li></ul><span class="toggle-end">}</span></span></li></ol><span class="toggle-end" card="1">]</span></span></li></ul><span class="toggle-end">}</span>,</span></li><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">year</span>"</span>:<span class="string">"1931"</span>,</li><li><span class="property">"<span class="p collapsible">months</span>"</span>:<span class="array"><span class="toggle">[</span><ol><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">month</span>"</span>:<span class="string">"02"</span>,</li><li><span class="property">"<span class="p">sightings</span>"</span>:<span class="number">1</span></li></ul><span class="toggle-end">}</span>,</span></li><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">month</span>"</span>:<span class="string">"06"</span>,</li><li><span class="property">"<span class="p">sightings</span>"</span>:<span class="number">1</span></li></ul><span class="toggle-end">}</span></span></li></ol><span class="toggle-end" card="2">]</span></span></li></ul><span class="toggle-end">}</span>,</span></li><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">year</span>"</span>:<span class="string">"1933"</span>,</li><li><span class="property">"<span class="p collapsible">months</span>"</span>:<span class="array"><span class="toggle">[</span><ol><li><span class="object"><span class="toggle">{</span><ul><li><span class="property">"<span class="p">month</span>"</span>:<span class="string">"04"</span>,</li><li><span class="property">"<span class="p">sightings</span>"</span>:<span class="number">1</span></li></ul><span class="toggle-end">}</span></span></li></ol><span class="toggle-end" card="1">]</span></span></li></ul><span class="toggle-end">}</span></span></li></ol><span class="toggle-end" card="3">]</span><br>...output omitted</span></div></div>
			</div>
		</div>
		
	</div>
	<div id="footer">
		<div class="left">
			<h4>Acknowledgements</h4>
			Thanks to <a href="http://simplehtmldom.sourceforge.net/" target="_BLANK">PHP Simple HTML DOM Parser</a> for easing the process of gathering the needed data for this API
			<br>
			Thanks to <a href="http://www.nwlink.com/~ufocntr/" target="_BLANK">the national UFO reporting center</a> for making the data publicly available.
			<br>
			Thanks to <a href="http://json.parser.online.fr/" target="_BLANK">json formatter</a> for styling the json output in this API.
		</div>
		
		<div class="footer-text">
			UC Berkeley School of Information<br>
			Information Organization Lab - Fall 2013<br>
			Ryan Baker, Ashley DeSouza, Victor Starostenko, Tom Quast
		</div>
	</div>

</main>
</body>
</html>
