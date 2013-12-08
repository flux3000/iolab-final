// Change this to adjust the date range we are using. Will need to change var BW (bar width) if the date range gets long enough.
var startYear = 1981; 


$(document).ready(function(){

	google.maps.event.addDomListener(window, 'load', mapsInitialize("map-container"));

	$("#start-year").text(startYear);

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


function displayTimeline(pointLocations){

	var events = [];
	//console.log(pointLocations);

	$.getJSON( "documents/events.json", function( eventdata ) {
		$.each( eventdata, function( key, val ) {
			var event = [key, val];

			thisMonth = val["month"];
			thisYear = val["year"];

			for (var i = 0; i < pointLocations.length; i++) {
				if (thisMonth == pointLocations[i][1] && thisYear == pointLocations[i][0]) {
					thisXCoord = pointLocations[i][2] - 12;
					console.log("x coord of "+thisMonth+"-"+thisYear+" is "+thisXCoord);
				}
			}
			//thisXCoord = 0;

			$("#timeline-events").append("<div class='event-icon' id='"+key+"' style='left:"+thisXCoord+"px;'>"+thisMonth+'-'+thisYear+"</div>");

			events.push(event);

		});
		console.log(events);
	});

	$("#timeline-events").on("click", ".event-icon", function() {
		
		$(this).siblings().removeClass("active");
		$(this).addClass("active");

		$("#timeline").animate({"height": "160px"}, "fast");
		$("#timeline-infobar").fadeIn("slow");

		var thisEventID = $(this).attr("id");
		var thisEventName = events[thisEventID][1]["name"];
		var thisEventDescription = events[thisEventID][1]["description"];
		var thisEventImage = events[thisEventID][1]["image"];
		var thisEventType = events[thisEventID][1]["type"];
		var thisEventMonth = events[thisEventID][1]["month"];
		var thisEventYear = events[thisEventID][1]["year"];

		$("#timeline-infobar").html("<img src='images/"+thisEventImage+"' style='width:75px;'>"+thisEventName + " " + thisEventDescription);

	});	

	$("#timeline-events").on("click", ".active", function() {
		$("#timeline-infobar").fadeOut("fast");
		$("#timeline").animate({"height": "40px"}, "fast");
		$(this).removeClass("active");

	});
	
}


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
				
				if (thisPoint.year >= startYear && thisPoint.year < 2013){
					monthCount++;
					//console.log(monthCount + ". " + thisPoint.date + " : " + thisPoint.sightings);	
					
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

	var pointLocations = [];

	var numPoints = data.length;
	// set up the svg 	
	var w = 1190;
	var h = 250;
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

	//console.log("startdate:"+startDate);
	//console.log("enddate:"+endDate);

	//xAxisScale and yAxisScale are for the axes
	var xAxisScale = d3.time.scale()
		.domain([startDate, endDate])
		.range([0, BTW*numPoints]);
	
	var yAxisScale = d3.scale.linear()
		.domain([0, 1000])
		.range([h-30, 0]);

	//Creating the y-axis
	var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left")
		.ticks(10);
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
				thisX = 40 + i*BTW;
				thisPointLocation = [d.year, d.month, i*BTW];
				pointLocations.push(thisPointLocation);
				return thisX;

			},
			"y": function(d, i) {
				return h - 20 - yScale(d.sightings);
			},
			"desc": function(d, i) {
				var v = moment([d.year, d.month-1])
				var displayDate = v.format("MMMM YYYY");
				return "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+"</strong> UFOs Reported</div>";

			},
			"fill" : function(d, i){
				/*
				if(i<(numPoints*.1)){return "#ff9d66";}
				else if(i<(numPoints*.2)){return "#f6925a";}
				else if(i<(numPoints*.3)){return "#ee884f";}
				else if(i<(numPoints*.4)){return "#e57e44";}
				else if(i<(numPoints*.5)){return "#dd7438";}
				else if(i<(numPoints*.6)){return "#d4692d";}
				else if(i<(numPoints*.7)){return "#cc5f22";}
				else if(i<(numPoints*.8)){return "#c35516";}
				else if(i<(numPoints*.9)){return "#bb4b0b";}
				else {
				*/
				return "#b34100";
			},
			"class" : "bar"
	    })
		.on("click", function(d, i) {
			// run when user clicks on a bar in the chart. 
			//populate sidebar with details on this month's sightings.
			var dataString = 'month='+d.month+'&year='+d.year;

			$.ajax({
				url: "http://ufo.quast.li/backend/ufoMapper.php",
				data: dataString,
				success: function(data) {
					displayDetailsHeader(d.year, d.month, d.sightings); 
					displayDetails(data);
					prepareMonthData(data, d.year, d.month);
				},
				error: function(e){console.log("error: " + e);}
			});
		});		    

	//Changing color of the rect when clicked
	$(".bar").click(function() {
		$(this).siblings().attr("fill", "#b34100");
		$(this).attr("fill", "#FFD573"); // Yellow highlight
		//$( this ).toggleClass("selected", addOrRemove); // doesn't work, because fill attribute overrides classes
	});

	//Animating the rects of the diagrams on hover
	$(".bar").hover(
		function() {
			var y = parseFloat($(this).attr("y")) + 0;
			$(this).css("opacity", "0.6").attr("y", y);
			
			//Setting the info-text
			var txt = $(this).attr("desc");
			var left = $(this).position().left - 60;
			var top = h - 50;
			$(".info").html(txt).css({"left" : left, "top" : top}).show();
		}, 
		function() {
			var y = parseFloat($(this).attr("y")) - 0;
			$(this).css("opacity", "1").attr("y", y);
			$(".info").hide();
		}
	);

	displayTimeline(pointLocations);

}

function displayDetailsChart(data) {
	var json = JSON.parse(data);
	//console.log(json);
		thisSightingDateArr = json[i]["date"].split("-");
		thisSightingYear = thisSightingDateArr[0];
		thisSightingMonth = thisSightingDateArr[1];
		thisSightingDay = thisSightingDateArr[2];	
	graphMonthData(json);

}

function displayDetailsHeader(year, month, sightings){
	var thisMonth = parseInt(month)-1;
	var a = moment([year, thisMonth])
	var displayDate = a.format("MMMM YYYY");
	$("#sighting-list").empty();
	if (parseInt(sightings) > 1) {
		var ufos = "UFOs";
	} else {
		var ufos = "UFO";
	}
	$("#sidebar-content-header").html(sightings+" "+ufos+" reported in "+displayDate).show();

}

function displayDetails(data){
	var json = JSON.parse(data);
	//console.log(json);
	
	for (var i = 0; i < json.length; i++) {
		thisSightingDateArr = json[i]["date"].split("-");
		thisSightingYear = thisSightingDateArr[0];
		thisSightingMonth = thisSightingDateArr[1];
		thisSightingDay = thisSightingDateArr[2];
		var a = moment([thisSightingYear, thisSightingMonth-1, thisSightingDay])
		var displayDate = a.format("D MMMM YYYY");

		thisSightingHTML = "<div class='sighting-item'>";
		thisSightingHTML += "<div class='title'>" + displayDate + " - " + json[i]["city"] + ", " + json[i]["state"] + "</div>";
		thisSightingHTML += "<div class='description'><strong>Shape:</strong> " + json[i]["shape"] + "&nbsp;&nbsp;<strong>Duration:</strong> " + json[i]["duration"] + "<br><br>" + json[i]["summary"] + "</div>";
		thisSightingHTML += "</div>";

		$("#sighting-list").append("<li>"+thisSightingHTML+"</li>");

	}

}

function prepareMonthData(data, year, month){

	// this creates the small chart in the left sidebar, displaying the day-by-day breakdown of reports in a chosen month.

	myMonthUFOs = [];
	var dayCount = 0;
	var json = JSON.parse(data);

	// go through each day in the calendar month. If there is a sighting for this day in our dataset, we will record the sightings under the "count" variable. If there is no data, "count" will be 0.

	for (var j = 1; j < 32; j++){ // needs fix to figure out days in month
		var thisPoint = [];
		thisPoint.year = year;
		thisPoint.month = month;
		thisPoint.day = j;
		thisPoint.sightings = 0; 
		for (var i = 0; i < data.length; i++) {
			//console.log(json[i]);
			
			if (typeof json[i] != 'undefined'){
				
				thisSightingDateArr = json[i]["date"].split("-");
				thisSightingDay = thisSightingDateArr[2];

				if (thisSightingDay == j) {
					thisPoint.sightings += 1;
				}				
			}
	    }
	    console.log(thisPoint.year + "-" + thisPoint.month + "-"+thisPoint.day+" : " + thisPoint.sightings);

		myMonthUFOs.push(thisPoint);    
	}
    graphMonthData(myMonthUFOs);
}


function graphMonthData(data){
	console.log(data);

	$("#month-visualization").empty();

	var numPoints = data.length;
	// set up the svg 	
	var w = 350;
	var h = 100;
	var svg = d3.select("#month-visualization");
	svg.attr("width", w).attr("height", h);

	//setting variables for drawing
	var BW = 9; //Bar width
	var BTW = BW+2; //Bar Total Width
	var OL = 24; //Offset Left

	//Setting the scales for the graph
	// xScale and yScale are for the data points
	var xScale = d3.time.scale()
		.domain([1, numPoints])
		.range([0, BTW*numPoints]);

	var yScale = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.sightings; })])
		.range([0, h-5]);

	//console.log("startdate:"+startDate);
	//console.log("enddate:"+endDate);

	//xAxisScale and yAxisScale are for the axes
	var xAxisScale = d3.scale.linear()
		.domain([1, numPoints]) // need to fix - days in month
		.range([0, BTW*numPoints]); // need to fix
	
	var yAxisScale = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.sightings; })])
		.range([h-5, 0]);

	//Creating the y-axis
	var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left")
		.ticks(5);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(14," + 0 + ")")
		.call(yAxis);

	//Creating the x-axis
	var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient("bottom")
        .tickSize(2, 0)
        .ticks(10);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(14," + (h-5) + ")")
		.call(xAxis);
	
	//Drawing the bars of the graph
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")	
		.attr({
			"width": BW,		
			"x": function(d, i) {
				return 15 + i*BTW;
			},
        	"height": 0,
			"y": function(d, i) {
				return h-5;
			} ,   
			"desc": function(d, i) {
				var v = moment([d.year, d.month-1, d.day])
				var displayDate = v.format("MMMM Do YYYY");
				return "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+"</strong></div>";

			},
			"fill" : function(d, i){
				return "#FFD573"; // yellow
			},
			"stroke-width": 1,
			"stroke": "#C99C30",
			"class" : "smallbar",
	    })
        .transition()
        .attr({
        	"height": function(d, i) {
			    return yScale(d.sightings);
			},
			"y": function(d, i) {
				return h - 5 - yScale(d.sightings);
			}       
    	})
        .duration(500)	

/*		.on("click", function(d, i) {
			// run when user clicks on a bar in the chart. 
			//populate sidebar with details on this month's sightings.
			var dataString = 'month='+d.month+'&year='+d.year;

			$.ajax({
				url: "http://ufo.quast.li/backend/ufoMapper.php",
				data: dataString,
				success: function(data) {
					displayDetailsHeader(d.year, d.month, d.sightings); 
					displayDetails(data);
				},
				error: function(e){console.log("error: " + e);}
			});
		});		    
*/
	//Changing color of the rect when clicked
	$(".smallbar").click(function() {
		$(this).siblings().attr("fill", "#FFD573");
		$(this).attr("fill", "#b34100");
		//$( this ).toggleClass("selected", addOrRemove); // doesn't work, because fill attribute overrides classes
	});

	//Animating the rects of the diagrams on hover
	$(".smallbar").hover(
		function() {
			var y = parseFloat($(this).attr("y")) + 0;
			$(this).css("opacity", "0.6").attr("y", y);
			
			//Setting the info-text
			var txt = $(this).attr("desc");
			var left = $(this).position().left - 40;
			var top = h - 50;
			$(".sidebar-info").html(txt).css({"left" : left, "top" : top}).show();
		}, 
		function() {
			var y = parseFloat($(this).attr("y")) - 0;
			$(this).css("opacity", "1").attr("y", y);
			$(".sidebar-info").hide();
		}
	);

}


function mapData(data){
	//console.log(data);
}

// google maps code
var map;
function mapsInitialize(targetID) {
    var myLatlng = new google.maps.LatLng(41.850033, -87.6500523);
    
    var mapOptions = {
        zoom: 4,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP   
    };
    map = new google.maps.Map(document.getElementById(targetID), mapOptions);
}
