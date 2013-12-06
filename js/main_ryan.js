$(document).ready(function(){
	$.ajax({
		url: "http://ufo.quast.li/backend/graph.php",
		success: graphTest,
		error: function(e){console.log("error: " + e);}
	});
	
	$.ajax({
		url: "http://ufo.quast.li/backend/mapper.php",
		success: mapData,
		error: function(e){console.log("error: " + e);}
	});
});

function graphTest(data){

    // Make JSON object that will contain all data points for our graph. Note that we must display a data point for every month, even if there were zero sightings that month. So, we must parse the JSON from the database and create a new object to account for this.
	
	myUFOs = [];
	// for each year...
	//for (var i = 0; i < data.length; i++) {

    for (var i = 0; i < 5; i++) {

    	var json = JSON.parse(data);

    	console.log(json[i]);

    	var thisSighting = [];
    	thisSighting.year = data[i]["year"];
    	dataMonths = data[i]["months"];
    	// go through each month in the calendar year. If there is a sighting for this month in our dataset, we will record the sightings under the "count" variable. If there is no data, "count" will be 0.
    	for (var j = 1; j < 13; j++){
    		if (j.length == 1) {
    			var thisMonth = "0"+j;
    		} else {
    			var thisMonth = ''+j;
    		}
    		thisSighting.month = thisMonth;
			for (var k in dataMonths) {
				if (dataMonths[k]["month"] == thisMonth) {
					thisSighting.count = dataMonths[k]["sightings"];
				}
			}    			
			if (thisSighting.count == 'undefined') {
				thisSighting.count = 0;
			}

			console.log(thisSighting);
    	}
    }

}


function graphData(data){
	console.log(data);

	// set up the svg 	
	var w = 1100;
	var h = 600;
	var svg = d3.select("#visualization");
	svg.attr("width", w).attr("height", h);

	//setting variables for drawing
	var BW = 1; //Bar width
	var BTW = BW; //Bar Total Width
	var CR = 6; //Circle Radius
	var CRB = 20; //Circle Radius (big)
	var OL = 50; //Offset Left
	//var SY = 2003; //start year


	//Setting the scales for the graph
	var yScale = d3.scale.linear()
		.domain([0, 10])
		.range([0, h-30]);
	var yAxisScale = d3.scale.linear()
		.domain([0, 10])
		.range([h-30, 0]);
	
	//Creating the y-axis
	var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left")
		.ticks(20);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(40," + 10 + ")")
		.call(yAxis);
	
	//Drawing the bars of the graph
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr({
			"width": BW,
			"height": function(d, i) {
			    return yScale(d);
			},
			"x": function(d, i) {
				return OL + i*BTW;
			},
			"y": function(d, i) {
				return h - 20 - yScale(d);
			},
			"desc": function(d, i) {
				if(! /\./.test(d)){ //add a .0 to even numbers, D3 removes them
					return d + ".0";
				}
				return d;
			},
			"fill" : function(d, i){
				if(i<12){return "#a5c9e5";}
				else if(i<24){return "#95bcdd";}
				else if(i<36){return "#85afd6";}
				else if(i<48){return "#6d9dcb";}
				else if(i<60){return "#5a8ec3";}
				else if(i<72){return "#447cb8";}
				else if(i<84){return "#326fb0";}
				else if(i<96){return "#2262a8";}
				else if(i<108){return "#1155a1";}
				else{return "#004799"}; //Setting the colors (blue gradient)
			},
			"class" : "bar"
	    });









}

function mapData(data){
	//console.log(data);
}