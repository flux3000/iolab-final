$(document).ready(function(){
	$.ajax({
		url: "http://ufo.quast.li/backend/graph.php",
		success: prepareData,
		error: function(e){console.log("error: " + e);}
	});
	
	$.ajax({
		url: "http://ufo.quast.li/backend/mapper.php",
		success: mapData,
		error: function(e){console.log("error: " + e);}
	});
});

function prepareData(data){

    // Make JSON object that will contain all data points for our graph. Note that we must display a data point for every month, even if there were zero sightings that month. So, we must parse the JSON from the database and create a new object to account for this.
	
	myUFOs = [];
	var monthCount = 0;
	var json = JSON.parse(data);

	for (var i = 0; i < data.length; i++) {
		//console.log(json[i]);
		
		if (typeof json[i] != 'undefined'){

	    	// go through each month in the calendar year. If there is a sighting for this month in our dataset, we will record the sightings under the "count" variable. If there is no data, "count" will be 0.

	    	for (var j = 1; j < 13; j++){
	    		var thisPoint = [];
	    		thisPoint.year = json[i]["year"];
	    		dataMonths = json[i]["months"];
	    		if (j<10) {
	    			var thisMonth = "0"+j;
	    		} else {
	    			var thisMonth = j;
	    		}
	    		thisPoint.month = thisMonth;
	    		thisPoint.date = thisPoint.year+"-"+thisPoint.month;
	    		thisPoint.sightings = 0;
				for (var k in dataMonths) {
					if (dataMonths[k]["month"] == thisMonth) {
						thisPoint.sightings = dataMonths[k]["sightings"];
					}
				}    			
				
				if (thisPoint.year >= 1990 && thisPoint.year < 2013){
					monthCount++;
					console.log(monthCount + ". " + thisPoint.date + " : " + thisPoint.sightings);	
					
					// add this point into the myUFOs object. This object will contain all the data we are mapping to the chart.
					
					myUFOs.push(thisPoint);
				}
	    	}
		}
    }

    graphData(myUFOs)

}


function graphData(data){
	//console.log(data);

	var numPoints = data.length;
	// set up the svg 	
	var w = 1000;
	var h = 600;
	var svg = d3.select("#visualization");
	svg.attr("width", w).attr("height", h);

	//setting variables for drawing
	var BW = 2; //Bar width
	var BTW = BW+1; //Bar Total Width
	var OL = 50; //Offset Left

	//Setting the scales for the graph
	// xScale and yScale are for the data points
	var xScale = d3.time.scale()
		.domain([0, data.length])
		.range([0, w]);

	var yScale = d3.scale.linear()
		.domain([0, 1000])
		.range([0, h-30]);

	var startDate = new Date(data[0].date);
	var endDate = new Date(data[data.length - 1].date);

	console.log("startdate:"+startDate);
	console.log("enddate:"+endDate);

	//xAxisScale and yAxisScale are for the axes
	var xAxisScale = d3.time.scale()
		.domain([startDate, endDate])
		.range([0, w]);
	
	var yAxisScale = d3.scale.linear()
		.domain([0, 1000])
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

	//Creating the x-axis
	var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient("bottom")
        .tickSize(6, 0)
		.ticks(d3.time.year, 2);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(40," + (h-20) + ")")
		.call(xAxis);
	
	//Drawing the bars of the graph
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr({
			"width": BW,
			"height": function(d, i) {
			    return yScale(d.sightings);
			},
			"x": function(d, i) {
				return 40 + i*BTW;
			},
			"y": function(d, i) {
				return h - 20 - yScale(d.sightings);
			},
			"desc": function(d, i) {
				return d.year+"-"+d.month+": "+d.sightings;
			},
			"fill" : function(d, i){
				if(i<(numPoints*.1)){return "#ff9d66";}
				else if(i<(numPoints*.2)){return "#f6925a";}
				else if(i<(numPoints*.3)){return "#ee884f";}
				else if(i<(numPoints*.4)){return "#e57e44";}
				else if(i<(numPoints*.5)){return "#dd7438";}
				else if(i<(numPoints*.6)){return "#d4692d";}
				else if(i<(numPoints*.7)){return "#cc5f22";}
				else if(i<(numPoints*.8)){return "#c35516";}
				else if(i<(numPoints*.9)){return "#bb4b0b";}
				else{return "#b34100"}; //Setting the colors (red gradient)
			},
			"class" : "bar"
	    });

	//Animating the rects of the diagrams on hover
	$(".bar").hover(
		function() {
			var y = parseFloat($(this).attr("y")) + 0;
			$(this).css("opacity", "0.6").attr("y", y);
			
			//Setting the info-text
			var txt = $(this).attr("desc");
			var left = $(this).position().left - 25;
			//var top = h - 125;
			var top = h - 125;
			$(".info").text(txt).css({"left" : left, "top" : top}).show();
		}, 
		function() {
			var y = parseFloat($(this).attr("y")) - 0;
			$(this).css("opacity", "1").attr("y", y);
			$(".info").hide();
		}
	);


}

function mapData(data){
	//console.log(data);
}