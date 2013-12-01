$(document).ready(function(){
	$.ajax({
		url: "http://ufo.quast.li/backend/graph.php",
		success: graphData,
		error: function(e){console.log("error: " + e);}
	});
	
	$.ajax({
		url: "http://ufo.quast.li/backend/mapper.php",
		success: mapData,
		error: function(e){console.log("error: " + e);}
	});
});

function graphData(data){
	console.log(data);
}

function mapData(data){
	console.log(data);
}