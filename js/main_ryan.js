/*
Function List:

displayTimeLine
prepareData
graphData
displayDetailsChart
displayDetailsHeader
displayDayDetailsHeader
displayDetails
displayDayDetails
prepareMonthData
graphMonthData
mapData
mapsInitialize

*/
// Change this to adjust the date range we are using. Will need to change var BW (bar width) if the date range gets long enough.
var startYear = 1981; 
var myUFOs = [];

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


function displayTimeline(pointLocations, foo){

	var events = [];
	//console.log(pointLocations);

	$.getJSON( "documents/events.json", function( eventdata ) {
		$.each( eventdata, function( key, val ) {
			var event = [key, val];

			thisMonth = val["month"];
			thisYear = val["year"];
			thisType = val["type"]
			iconUrl = ""
/* 			if (thisType == "Movie") {
				var iconUrl = "(../images/icons/movie.jpg)"
			} */
			switch (thisType) {
				case "Movie":
					iconUrl = "(../images/icons/movie.jpg)"
					break;
				case "Astronomy":
					iconUrl = "(../images/icons/astronomy.jpg)"
					break;
				case "Event":
					iconUrl = "(../images/icons/event.jpg)"
					break;
			}

			for (var i = 0; i < pointLocations.length; i++) {
				if (thisMonth == pointLocations[i][1] && thisYear == pointLocations[i][0]) {
					thisXCoord = pointLocations[i][2] - 8;
					//console.log("x coord of "+thisMonth+"-"+thisYear+" is "+thisXCoord);
				}
			}
			//thisXCoord = 0;

			$("#timeline-events").append("<div class='event-icon' id='"+key+
										"' style='left:"+thisXCoord+"px; background-image:url"+iconUrl+";'>"+
										"</div>");
			events.push(event);

		});
		//console.log(events);
		$(".event-icon").css({'cursor': 'pointer'});

	});

	$("#timeline-events").on("click", ".event-icon:not(.active)", function() {

		var pointerXPos = ($(this).position().left)+11;

		$(".month-marker").hide();

		//console.log("making bars red");
		$('svg#visualization').children("rect").attr("fill", "#b34100"); // make all bars red

		$('.event-icon-pointer').hide().delay(400).css({"left": pointerXPos}).fadeIn(800);
		$('.event-icon-up-pointer').hide().delay(400).css({"left": pointerXPos}).fadeIn(800);

		$(this).siblings().removeClass("active").children('.event-icon-pointer').fadeOut("slow")
		$(this).siblings().children('.event-icon-up-pointer').fadeOut("slow")
		$(this).addClass("active");

		$("#timeline").animate({"height": "200px"}, 400);

		var thisEventID = $(this).attr("id");
		var thisEventName = events[thisEventID][1]["name"];
		var thisEventStats = events[thisEventID][1]["stats"];
		var thisEventDescription = events[thisEventID][1]["description"];
		var thisEventImage = events[thisEventID][1]["image"];
		var thisEventURL = events[thisEventID][1]["url"];
		var thisEventType = events[thisEventID][1]["type"];
		var thisEventMonth = events[thisEventID][1]["month"];
		var thisEventYear = events[thisEventID][1]["year"];

		var a = moment([thisEventYear, thisEventMonth])
		var displayDate = a.format("MMMM YYYY");
		var titleDate = a.format("YYYY-MM");

		var thisInfobarHTML = "<div id='timeline-infobar-contents'>";
		thisInfobarHTML += "<div class='close'>&#x2715;</div>";
		thisInfobarHTML += "<div class='img'><img src='images/"+thisEventImage+"' alt='"+thisEventName+"'></div>";
		thisInfobarHTML += "<div class='title'><strong>"+displayDate+" - "+thisEventName+"</strong><br>"+thisEventStats+"</div>";
		thisInfobarHTML += "<div class='description'>"+thisEventDescription+"</div>";
		thisInfobarHTML += "<div class='link'><a href='"+thisEventURL+"' target='_new'>Wikipedia</a></div>";
		thisInfobarHTML += "</div>";

		var thisBarHeight;
		var thisBarXCoord;
		var thisBarYCoord;

		$('svg#visualization').children("rect[title='"+titleDate+"']").delay(300).queue(function() {
			$(this).attr("fill", "#FFD573"); // make correct bar yellow
			thisBarHeight = $(this).attr("height");
			thisBarXCoord = $(this).attr("x");
			thisBarYCoord = $(this).attr("y");

			//console.log("making bar "+titleDate+" yellow");
		});

		$("#timeline-infobar").delay(400).fadeIn(400).html(thisInfobarHTML);

		var dataString = 'month='+(parseInt(thisEventMonth)+1)+'&year='+thisEventYear;
		$.ajax({
			url: "http://ufo.quast.li/backend/ufoMapper.php",
			data: dataString,
			success: function(data) {
				var json = JSON.parse(data);
				var thisMonthSightings = json.length;

				//Setting the marker text and location
				var markerleft = (parseInt(thisBarXCoord) + 80) + "px";
				console.log(markerleft);

				var markertop = 250 - (thisBarHeight) + 42 + "px";
				var v = moment([thisEventYear, parseInt(thisEventMonth)+1]);
				var displayDate = v.format("MMM YYYY");	
				var markertxt = "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+thisMonthSightings+"</strong></div>";

				$(".month-marker").html(markertxt).css({"left" : markerleft, "top" : markertop}).show();

				displayDetailsHeader(thisEventYear, parseInt(thisEventMonth)+1, thisMonthSightings); 
				displayDetails(data);
				prepareMonthData(data, thisEventYear, parseInt(thisEventMonth)+1);
			},
			error: function(e){console.log("error: " + e);}
		});

	});	

	$("#timeline-events").on("click", ".active", function() {

		$('.event-icon-pointer').hide();
		$('.event-icon-up-pointer').hide();
		$('svg#visualization').children("rect").delay(300).queue(function() {
			$(this).attr("fill", "#b34100"); // make all bars red
		});

		$("#timeline-infobar").fadeOut(400);
		$("#timeline").delay(400).animate({"height": "48px"}, 400);

		$(this).removeClass("active");

	});

	$("#timeline-infobar").on("click", ".close", function() {

		$('.event-icon-pointer').hide();
		$('.event-icon-up-pointer').hide();

		$("#timeline-infobar").fadeOut(400);
		$("#timeline").delay(400).animate({"height": "48px"}, 400);

		$(this).siblings("#timeline-events").removeClass("active");
	});
}


function prepareData(data){

    // Make JSON object that will contain all data points for our graph. Note that we must display a data point for every month, even if there were zero sightings that month. So, we must parse the JSON from the database and create a new object to account for this.

	var monthCount = 0;
	var json = JSON.parse(data);

	for (var i = 0; i < data.length; i++) {
		//console.log(json[i]);
		
		if (typeof json[i] != 'undefined'){

	    	// go through each month in the calendar year. If there is a sighting for this month in our dataset, we will record the sightings under the "count" variable. If there is no data, "count" will be 0.

	    	for (var j = 1; j < 13; j++){
	    		var thisPoint = [];
				//var lastPoint = [];
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
				//lastPoint.sightings = 0;
				for (var k in dataMonths) {
					if (dataMonths[k]["month"] == thisMonth) {
						thisPoint.sightings = dataMonths[k]["sightings"];
						//lastPoint.sightings = dataMonths[k-1]["sightings"];
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

	//xAxisGridLines and yAxisGridLines for the grid lines	
	var xAxisGridLines = d3.svg.axis()
						.scale(xAxisScale)
						.orient("bottom")
						.ticks(20);

	var yAxisGridLines = d3.svg.axis()
						.scale(yAxisScale)
						.orient("left")
						.ticks(10);

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
        .tickSize(8, 0)
		.ticks(d3.time.year, 2);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(40," + (h-20) + ")")
		.call(xAxis);
	
	//Drawing Grid Lines
	var xGridLines = svg.append("g")
						.attr("class", "grid")
						.attr("transform", "translate(" + 40 + "," + (h - 20)  + ")")
						.style("stroke-dasharray", ("3, 3"))
						.call(xAxisGridLines
								.tickSize(-h + 30,0,0)
								.tickFormat("")
							);
								
	var yGridLines = svg.append("g")
						.attr("class", "grid")
						.attr("transform", "translate(40,10)")
						.style("stroke-dasharray", ("3, 3"))
						.call(yAxisGridLines
								.tickSize(-w + 40,0,0)
								.tickFormat("")
							);

	//Drawing the bars of the graph
	
	sightingsArray = []; //this array collects all sightings values for all months to be later used for finding % increase/decrease
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
				var v = moment([d.year, d.month-1]);
				var displayDate = v.format("MMMM YYYY");
				
				//adding sighting numbers to array
				sightingsArray.push(d.sightings);
				//finding the previous month's sightings
				prevSighting = sightingsArray[sightingsArray.length-2];
				//% change
				pChange = (((d.sightings-prevSighting)/prevSighting)*100).toFixed(2);
				if (pChange >= 0) {
					pChangeText = "</strong>% Increase from Previous Month</div>"
				}
				else {
					pChangeText = "</strong>% Decrease from Previous Month</div>"
				}
				
				return "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+"</strong> UFOs Reported</div><div class='description'><strong>"+Math.abs(pChange)+pChangeText;

			},
			
			"markerdesc": function(d,i){
				var v = moment([d.year, d.month-1]);
				var displayDate = v.format("MMM YYYY");
				return "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+"</strong></div>";
			},
			"title": function(d, i) {
				var v = moment([d.year, d.month-1]);
				var titleDate = v.format("YYYY-MM");
				return titleDate;
			},
			"fill" : function(d, i){
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

	//Changing color of the rect when clicked, adding month-marker popup
	$(".bar").click(function() {
		$(this).siblings().attr("fill", "#b34100");
		$(this).attr("fill", "#FFD573"); // Yellow highlight
		
		//Setting the marker text and location
		var markertxt = $(this).attr("markerdesc");
		var markerleft = ($(this).position().left - 31) + "px";
		var markertop = h - ($(this).attr("height")) + 42 + "px";
		$(".month-marker").hide();
		$(".month-marker").html(markertxt).css({"left" : markerleft, "top" : markertop}).show();			
		$('.event-icon-pointer').hide();
		$('.event-icon-up-pointer').hide();

		$("#timeline-infobar").fadeOut(400);
		$("#timeline").delay(400).animate({"height": "48px"}, 400);

		$("#timeline-events").removeClass("active");

	});

	//Animating the rects of the diagrams on hover
	$(".bar").hover(
		function() {
			var y = parseFloat($(this).attr("y")) + 0;
			$(this).css("opacity", "0.6").attr("y", y);
			
			//Setting the info-text
			var txt = $(this).attr("desc");
			//var left = $(this).position().left - 60;
			var left = (event.pageX) + "px"; 
			//var top = h - 50;
			var top = (event.pageY - 50) + "px"; 
			$(".info").html(txt).css({"left" : left, "top" : top}).show();
		}, 
		function() {
			var y = parseFloat($(this).attr("y")) - 0;
			$(this).css("opacity", "1").attr("y", y);
			$(".info").hide();
		}
	);

	displayTimeline(pointLocations, data);

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

function displayDayDetailsHeader(year, month, day, sightings){
	var thisMonth = parseInt(month)-1;
	var a = moment([year, thisMonth, day])
	var displayDate = a.format("MMMM Do YYYY");
	$("#sighting-list").empty();
	if (parseInt(sightings) > 1) {
		var ufos = "UFOs";
	} else {
		var ufos = "UFO";
	}
	$("#sidebar-content-header").html(sightings+" "+ufos+" reported on "+displayDate).show();

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

function displayDayDetails(data, day){

	var json = JSON.parse(data);
	var selectedDetails = []; // this is the JSON object that will feed the map

	for (var i = 0; i < json.length; i++) {

		thisSightingDateArr = json[i]["date"].split("-");
		thisSightingYear = thisSightingDateArr[0];
		thisSightingMonth = thisSightingDateArr[1];
		thisSightingDay = thisSightingDateArr[2];

		if (thisSightingDay == day) {

			selectedDetails.push(json[i]); // add this result to the JSON that will feed the map

			var a = moment([thisSightingYear, thisSightingMonth-1, thisSightingDay])
			var displayDate = a.format("D MMMM YYYY");

			thisSightingHTML = "<div class='sighting-item'>";
			thisSightingHTML += "<div class='title'>" + displayDate + " - " + json[i]["city"] + ", " + json[i]["state"] + "</div>";
			thisSightingHTML += "<div class='description'><strong>Shape:</strong> " + json[i]["shape"] + "&nbsp;&nbsp;<strong>Duration:</strong> " + json[i]["duration"] + "<br><br>" + json[i]["summary"] + "</div>";
			thisSightingHTML += "</div>";

			$("#sighting-list").append("<li>"+thisSightingHTML+"</li>");

		}
	}

	mapData(selectedDetails);

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
	    //console.log(thisPoint.year + "-" + thisPoint.month + "-"+thisPoint.day+" : " + thisPoint.sightings);

		myMonthUFOs.push(thisPoint);    
	}
    graphMonthData(myMonthUFOs);
}


function graphMonthData(data){
	//console.log(data);

	$("#month-visualization").empty();

	var numPoints = data.length;
	// set up the svg 	
	var w = 390;
	var h = 140;
	var svg = d3.select("#month-visualization");
	svg.attr("width", w).attr("height", h);

	//setting variables for drawing
	var BW = 8; //Bar width
	var BTW = BW+2; //Bar Total Width
	var OL = 24; //Offset Left

	//Setting the scales for the graph
	// xScale and yScale are for the data points
	var xScale = d3.time.scale()
		.domain([1, numPoints])
		.range([0, BTW*numPoints]);

	var yScale = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.sightings; })])
		.range([0, h-35]);

	//console.log("startdate:"+startDate);
	//console.log("enddate:"+endDate);

	//xAxisScale and yAxisScale are for the axes
	var xAxisScale = d3.scale.linear()
		.domain([1, numPoints]) // need to fix - days in month
		.range([0, BTW*numPoints]); // need to fix
	
	var yAxisScale = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.sightings; })])
		.range([h-35, 0]);

	//Creating the y-axis
	var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left")
		.ticks(5);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(30," + 0 + ")")
		.call(yAxis);

	//Creating the x-axis
	var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient("bottom")
        .tickSize(2, 0)
        .ticks(10);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(30," + (h-35) + ")")
		.call(xAxis);

	//Ashley: Drawing the Axis Labels	
	var xAxisLabel = svg.append("text")
						.attr("fill", "#aaa")
						.attr("font-size", "10px")
						.attr("font-weight", "normal")
						.attr("text-anchor", "middle")
						.attr("transform", "translate(" + ((w/2)-10) + "," + (h-5) + ")")
						.text("Day of Month");
	
	//Ashley: Drawing the Axis Labels
	var yAxisLabel = svg.append("text")
						.attr("fill", "#aaa")
						.attr("font-size", "10px")
						.attr("font-weight", "normal")
						.attr("text-anchor", "middle")
						.attr("transform", "rotate(-90)")
						.attr("x", 0 - h/2)
						.attr("y", -13)
						.attr("dy", "1em")
						.text("# of Sightings");			

	//Drawing the bars of the graph
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.on("click", function(d, i) {
			// run when user clicks on a bar in the small sidechart. 
			// populate sidebar with details on this day's sightings.

			var dataString = 'month='+d.month+'&year='+d.year;

			$.ajax({
				url: "http://ufo.quast.li/backend/ufoMapper.php",
				data: dataString,
				success: function(data) {
					displayDayDetailsHeader(d.year, d.month, d.day, d.sightings); 
					displayDayDetails(data, d.day);

				},
				error: function(e){console.log("error: " + e);}
			});

		})	

		.attr({
			"width": BW,		
			"x": function(d, i) {
				return 32 + i*BTW;
			},
        	"height": 0,
			"y": function(d, i) {
				return h-35;
			} ,   
			"desc": function(d, i) {
				var v = moment([d.year, d.month-1, d.day])
				var displayDate = v.format("MMMM Do YYYY");
				return "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+" UFOs Reported</strong></div>";
			},
			"fill" : function(d, i){
				return "#FFD573"; // yellow FFD573
			},
			"stroke-width": 1,
			"stroke": "#C99C30", // dark yellow C99C30
			"class" : "smallbar",
	    })
        .transition()
        .attr({
        	"height": function(d, i) {
			    return yScale(d.sightings);
			},
			"y": function(d, i) {
				return h - 35 - yScale(d.sightings);
			}       
    	})
        .duration(500)	

	//Changing color of the rect when clicked
	$(".smallbar").click(function() {
		$(this).siblings(".smallbar").attr({"fill": "#FFD573", "stroke": "#C99C30"}); // yellow FFD573, Dk Yellow C99C30
		$(this).attr({"fill": "#286EB8", "stroke": "#215082"}); // green 539120 dkgrn 25420d blue 286EB8  dkblue 215082
		//$( this ).toggleClass("selected", addOrRemove); // doesn't work, because fill attribute overrides classes
	});

	//Animating the rects of the diagrams on hover
	$(".smallbar").hover(
		function() {
			var y = parseFloat($(this).attr("y")) + 0;
			$(this).css("opacity", "0.6").attr("y", y);
			
			//Setting the info-text
			var txt = $(this).attr("desc");
			//var left = $(this).position().left - 60;
			var left = (event.pageX) + "px"; 
			//var top = h - 50;
			var top = (event.pageY - 50) + "px"; 
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
// Ashley: google maps code
var map, pointarray, heatmap,
taxiData = [
  new google.maps.LatLng(37.782551, -122.445368),
  new google.maps.LatLng(37.782745, -122.444586),
  new google.maps.LatLng(37.782842, -122.443688),
  new google.maps.LatLng(37.782919, -122.442815),
  new google.maps.LatLng(37.782992, -122.442112),
  new google.maps.LatLng(37.783100, -122.441461),
  new google.maps.LatLng(37.783206, -122.440829),
  new google.maps.LatLng(37.783273, -122.440324),
  new google.maps.LatLng(37.783316, -122.440023),
  new google.maps.LatLng(37.783357, -122.439794),
  new google.maps.LatLng(37.783371, -122.439687),
  new google.maps.LatLng(37.783368, -122.439666),
  new google.maps.LatLng(37.783383, -122.439594),
  new google.maps.LatLng(37.783508, -122.439525),
  new google.maps.LatLng(37.783842, -122.439591),
  new google.maps.LatLng(37.784147, -122.439668),
  new google.maps.LatLng(37.784206, -122.439686),
  new google.maps.LatLng(37.784386, -122.439790),
  new google.maps.LatLng(37.784701, -122.439902),
  new google.maps.LatLng(37.784965, -122.439938),
  new google.maps.LatLng(37.785010, -122.439947),
  new google.maps.LatLng(37.785360, -122.439952),
  new google.maps.LatLng(37.785715, -122.440030),
  new google.maps.LatLng(37.786117, -122.440119),
  new google.maps.LatLng(37.786564, -122.440209),
  new google.maps.LatLng(37.786905, -122.440270),
  new google.maps.LatLng(37.786956, -122.440279),
  new google.maps.LatLng(37.800224, -122.433520),
  new google.maps.LatLng(37.800155, -122.434101),
  new google.maps.LatLng(37.800160, -122.434430),
  new google.maps.LatLng(37.800378, -122.434527),
  new google.maps.LatLng(37.800738, -122.434598),
  new google.maps.LatLng(37.800938, -122.434650),
  new google.maps.LatLng(37.801024, -122.434889),
  new google.maps.LatLng(37.800955, -122.435392),
  new google.maps.LatLng(37.800886, -122.435959),
  new google.maps.LatLng(37.800811, -122.436275),
  new google.maps.LatLng(37.800788, -122.436299),
  new google.maps.LatLng(37.800719, -122.436302),
  new google.maps.LatLng(37.800702, -122.436298),
  new google.maps.LatLng(37.800661, -122.436273),
  new google.maps.LatLng(37.800395, -122.436172),
  new google.maps.LatLng(37.800228, -122.436116),
  new google.maps.LatLng(37.800169, -122.436130),
  new google.maps.LatLng(37.800066, -122.436167),
  new google.maps.LatLng(37.784345, -122.422922),
  new google.maps.LatLng(37.784389, -122.422926),
  new google.maps.LatLng(37.784437, -122.422924),
  new google.maps.LatLng(37.784746, -122.422818),
  new google.maps.LatLng(37.785436, -122.422959),
  new google.maps.LatLng(37.786120, -122.423112),
  new google.maps.LatLng(37.786433, -122.423029),
  new google.maps.LatLng(37.786631, -122.421213),
  new google.maps.LatLng(37.786660, -122.421033),
  new google.maps.LatLng(37.786801, -122.420141),
  new google.maps.LatLng(37.786823, -122.420034),
  new google.maps.LatLng(37.786831, -122.419916),
  new google.maps.LatLng(37.787034, -122.418208),
  new google.maps.LatLng(37.787056, -122.418034),
  new google.maps.LatLng(37.787169, -122.417145),
  new google.maps.LatLng(37.787217, -122.416715),
  new google.maps.LatLng(37.786144, -122.416403),
  new google.maps.LatLng(37.785292, -122.416257),
  new google.maps.LatLng(37.780666, -122.390374),
  new google.maps.LatLng(37.780501, -122.391281),
  new google.maps.LatLng(37.780148, -122.392052),
  new google.maps.LatLng(37.780173, -122.391148),
  new google.maps.LatLng(37.780693, -122.390592),
  new google.maps.LatLng(37.781261, -122.391142),
  new google.maps.LatLng(37.781808, -122.391730),
  new google.maps.LatLng(37.782340, -122.392341),
  new google.maps.LatLng(37.782812, -122.393022),
  new google.maps.LatLng(37.783300, -122.393672),
  new google.maps.LatLng(37.783809, -122.394275),
  new google.maps.LatLng(37.784246, -122.394979),
  new google.maps.LatLng(37.784791, -122.395958),
  new google.maps.LatLng(37.785675, -122.396746),
  new google.maps.LatLng(37.786262, -122.395780),
  new google.maps.LatLng(37.786776, -122.395093),
  new google.maps.LatLng(37.787282, -122.394426),
  new google.maps.LatLng(37.787783, -122.393767),
  new google.maps.LatLng(37.788343, -122.393184),
  new google.maps.LatLng(37.788895, -122.392506),
  new google.maps.LatLng(37.789371, -122.391701),
  new google.maps.LatLng(37.789722, -122.390952),
  new google.maps.LatLng(37.790315, -122.390305),
  new google.maps.LatLng(37.790738, -122.389616),
  new google.maps.LatLng(37.779448, -122.438702),
  new google.maps.LatLng(37.779023, -122.438585),
  new google.maps.LatLng(37.778542, -122.438492),
  new google.maps.LatLng(37.778100, -122.438411),
  new google.maps.LatLng(37.777986, -122.438376),
  new google.maps.LatLng(37.777680, -122.438313),
  new google.maps.LatLng(37.777316, -122.438273),
  new google.maps.LatLng(37.777135, -122.438254),
  new google.maps.LatLng(37.776987, -122.438303),
  new google.maps.LatLng(37.776946, -122.438404),
  new google.maps.LatLng(37.776944, -122.438467),
  new google.maps.LatLng(37.776892, -122.438459),
  new google.maps.LatLng(37.776842, -122.438442),
  new google.maps.LatLng(37.776822, -122.438391),
  new google.maps.LatLng(37.776814, -122.438412),
  new google.maps.LatLng(37.776787, -122.438628),
  new google.maps.LatLng(37.776729, -122.438650),
  new google.maps.LatLng(37.776759, -122.438677),
  new google.maps.LatLng(37.776772, -122.438498),
  new google.maps.LatLng(37.776787, -122.438389),
  new google.maps.LatLng(37.776848, -122.438283),
  new google.maps.LatLng(37.776870, -122.438239),
  new google.maps.LatLng(37.777015, -122.438198),
  new google.maps.LatLng(37.777333, -122.438256),
  new google.maps.LatLng(37.777595, -122.438308),
  new google.maps.LatLng(37.777797, -122.438344),
  new google.maps.LatLng(37.778160, -122.438442),
  new google.maps.LatLng(37.778414, -122.438508),
  new google.maps.LatLng(37.778445, -122.438516),
  new google.maps.LatLng(37.778503, -122.438529),
  new google.maps.LatLng(37.778607, -122.438549),
  new google.maps.LatLng(37.778670, -122.438644),
  new google.maps.LatLng(37.778847, -122.438706),
  new google.maps.LatLng(37.779240, -122.438744),
  new google.maps.LatLng(37.779738, -122.438822),
  new google.maps.LatLng(37.780201, -122.438882),
  new google.maps.LatLng(37.780400, -122.438905),
  new google.maps.LatLng(37.780501, -122.438921),
  new google.maps.LatLng(37.780892, -122.438986),
  new google.maps.LatLng(37.781446, -122.439087),
  new google.maps.LatLng(37.781985, -122.439199),
  new google.maps.LatLng(37.782239, -122.439249),
  new google.maps.LatLng(37.782286, -122.439266),
  new google.maps.LatLng(37.797847, -122.429388),
  new google.maps.LatLng(37.797874, -122.429180),
  new google.maps.LatLng(37.797885, -122.429069),
  new google.maps.LatLng(37.797887, -122.429050),
  new google.maps.LatLng(37.797933, -122.428954),
  new google.maps.LatLng(37.798242, -122.428990),
  new google.maps.LatLng(37.798617, -122.429075),
  new google.maps.LatLng(37.798719, -122.429092),
  new google.maps.LatLng(37.798944, -122.429145),
  new google.maps.LatLng(37.799320, -122.429251),
  new google.maps.LatLng(37.799590, -122.429309),
  new google.maps.LatLng(37.799677, -122.429324),
  new google.maps.LatLng(37.799966, -122.429360),
  new google.maps.LatLng(37.800288, -122.429430),
  new google.maps.LatLng(37.800443, -122.429461),
  new google.maps.LatLng(37.800465, -122.429474),
  new google.maps.LatLng(37.800644, -122.429540),
  new google.maps.LatLng(37.800948, -122.429620),
  new google.maps.LatLng(37.801242, -122.429685),
  new google.maps.LatLng(37.801375, -122.429702),
  new google.maps.LatLng(37.801400, -122.429703),
  new google.maps.LatLng(37.801453, -122.429707),
  new google.maps.LatLng(37.801473, -122.429709),
  new google.maps.LatLng(37.801532, -122.429707),
  new google.maps.LatLng(37.801852, -122.429729),
  new google.maps.LatLng(37.802173, -122.429789),
  new google.maps.LatLng(37.802459, -122.429847),
  new google.maps.LatLng(37.802554, -122.429825),
  new google.maps.LatLng(37.802647, -122.429549),
  new google.maps.LatLng(37.802693, -122.429179),
  new google.maps.LatLng(37.802729, -122.428751),
  new google.maps.LatLng(37.766104, -122.409291),
  new google.maps.LatLng(37.766103, -122.409268),
  new google.maps.LatLng(37.766138, -122.409229),
  new google.maps.LatLng(37.766183, -122.409231),
  new google.maps.LatLng(37.766153, -122.409276),
  new google.maps.LatLng(37.766005, -122.409365),
  new google.maps.LatLng(37.765897, -122.409570),
  new google.maps.LatLng(37.765767, -122.409739),
  new google.maps.LatLng(37.765693, -122.410389),
  new google.maps.LatLng(37.765615, -122.411201),
  new google.maps.LatLng(37.765533, -122.412121),
  new google.maps.LatLng(37.765467, -122.412939),
  new google.maps.LatLng(37.765444, -122.414821),
  new google.maps.LatLng(37.765444, -122.414964),
  new google.maps.LatLng(37.765318, -122.415424),
  new google.maps.LatLng(37.763961, -122.415296),
  new google.maps.LatLng(37.763115, -122.415196),
  new google.maps.LatLng(37.762967, -122.415183),
  new google.maps.LatLng(37.762278, -122.415127),
  new google.maps.LatLng(37.761675, -122.415055),
  new google.maps.LatLng(37.760932, -122.414988),
  new google.maps.LatLng(37.759337, -122.414862),
  new google.maps.LatLng(37.773187, -122.421922),
  new google.maps.LatLng(37.773043, -122.422118),
  new google.maps.LatLng(37.773007, -122.422165),
  new google.maps.LatLng(37.772979, -122.422219),
  new google.maps.LatLng(37.772865, -122.422394),
  new google.maps.LatLng(37.772779, -122.422503),
  new google.maps.LatLng(37.772676, -122.422701),
  new google.maps.LatLng(37.772606, -122.422806),
  new google.maps.LatLng(37.772566, -122.422840),
  new google.maps.LatLng(37.772508, -122.422852),
  new google.maps.LatLng(37.772387, -122.423011),
  new google.maps.LatLng(37.772099, -122.423328),
  new google.maps.LatLng(37.771704, -122.423783),
  new google.maps.LatLng(37.771481, -122.424081),
  new google.maps.LatLng(37.771400, -122.424179),
  new google.maps.LatLng(37.771352, -122.424220),
  new google.maps.LatLng(37.771248, -122.424327),
  new google.maps.LatLng(37.770904, -122.424781),
  new google.maps.LatLng(37.770520, -122.425283),
  new google.maps.LatLng(37.770337, -122.425553),
  new google.maps.LatLng(37.770128, -122.425832),
  new google.maps.LatLng(37.769756, -122.426331),
  new google.maps.LatLng(37.769300, -122.426902),
  new google.maps.LatLng(37.769132, -122.427065),
  new google.maps.LatLng(37.769092, -122.427103),
  new google.maps.LatLng(37.768979, -122.427172),
  new google.maps.LatLng(37.768595, -122.427634),
  new google.maps.LatLng(37.768372, -122.427913),
  new google.maps.LatLng(37.768337, -122.427961),
  new google.maps.LatLng(37.768244, -122.428138),
  new google.maps.LatLng(37.767942, -122.428581),
  new google.maps.LatLng(37.767482, -122.429094),
  new google.maps.LatLng(37.767031, -122.429606),
  new google.maps.LatLng(37.766732, -122.429986),
  new google.maps.LatLng(37.766680, -122.430058),
  new google.maps.LatLng(37.766633, -122.430109),
  new google.maps.LatLng(37.766580, -122.430211),
  new google.maps.LatLng(37.766367, -122.430594),
  new google.maps.LatLng(37.765910, -122.431137),
  new google.maps.LatLng(37.765353, -122.431806),
  new google.maps.LatLng(37.764962, -122.432298),
  new google.maps.LatLng(37.764868, -122.432486),
  new google.maps.LatLng(37.764518, -122.432913),
  new google.maps.LatLng(37.763435, -122.434173),
  new google.maps.LatLng(37.762847, -122.434953),
  new google.maps.LatLng(37.762291, -122.435935),
  new google.maps.LatLng(37.762224, -122.436074),
  new google.maps.LatLng(37.761957, -122.436892),
  new google.maps.LatLng(37.761652, -122.438886),
  new google.maps.LatLng(37.761284, -122.439955),
  new google.maps.LatLng(37.761210, -122.440068),
  new google.maps.LatLng(37.761064, -122.440720),
  new google.maps.LatLng(37.761040, -122.441411),
  new google.maps.LatLng(37.761048, -122.442324),
  new google.maps.LatLng(37.760851, -122.443118),
  new google.maps.LatLng(37.759977, -122.444591),
  new google.maps.LatLng(37.759913, -122.444698),
  new google.maps.LatLng(37.759623, -122.445065),
  new google.maps.LatLng(37.758902, -122.445158),
  new google.maps.LatLng(37.758428, -122.444570),
  new google.maps.LatLng(37.757687, -122.443340),
  new google.maps.LatLng(37.757583, -122.443240),
  new google.maps.LatLng(37.757019, -122.442787),
  new google.maps.LatLng(37.756603, -122.442322),
  new google.maps.LatLng(37.756380, -122.441602),
  new google.maps.LatLng(37.755790, -122.441382),
  new google.maps.LatLng(37.754493, -122.442133),
  new google.maps.LatLng(37.754361, -122.442206),
  new google.maps.LatLng(37.753719, -122.442650),
  new google.maps.LatLng(37.753096, -122.442915),
  new google.maps.LatLng(37.751617, -122.443211),
  new google.maps.LatLng(37.751496, -122.443246),
  new google.maps.LatLng(37.750733, -122.443428),
  new google.maps.LatLng(37.750126, -122.443536),
  new google.maps.LatLng(37.750103, -122.443784),
  new google.maps.LatLng(37.750390, -122.444010),
  new google.maps.LatLng(37.750448, -122.444013),
  new google.maps.LatLng(37.750536, -122.444040),
  new google.maps.LatLng(37.750493, -122.444141),
  new google.maps.LatLng(37.790859, -122.402808),
  new google.maps.LatLng(37.790864, -122.402768),
  new google.maps.LatLng(37.790995, -122.402539),
  new google.maps.LatLng(37.791148, -122.402172),
  new google.maps.LatLng(37.791385, -122.401312),
  new google.maps.LatLng(37.791405, -122.400776),
  new google.maps.LatLng(37.791288, -122.400528),
  new google.maps.LatLng(37.791113, -122.400441),
  new google.maps.LatLng(37.791027, -122.400395),
  new google.maps.LatLng(37.791094, -122.400311),
  new google.maps.LatLng(37.791211, -122.400183),
  new google.maps.LatLng(37.791060, -122.399334),
  new google.maps.LatLng(37.790538, -122.398718),
  new google.maps.LatLng(37.790095, -122.398086),
  new google.maps.LatLng(37.789644, -122.397360),
  new google.maps.LatLng(37.789254, -122.396844),
  new google.maps.LatLng(37.788855, -122.396397),
  new google.maps.LatLng(37.788483, -122.395963),
  new google.maps.LatLng(37.788015, -122.395365),
  new google.maps.LatLng(37.787558, -122.394735),
  new google.maps.LatLng(37.787472, -122.394323),
  new google.maps.LatLng(37.787630, -122.394025),
  new google.maps.LatLng(37.787767, -122.393987),
  new google.maps.LatLng(37.787486, -122.394452),
  new google.maps.LatLng(37.786977, -122.395043),
  new google.maps.LatLng(37.786583, -122.395552),
  new google.maps.LatLng(37.786540, -122.395610),
  new google.maps.LatLng(37.786516, -122.395659),
  new google.maps.LatLng(37.786378, -122.395707),
  new google.maps.LatLng(37.786044, -122.395362),
  new google.maps.LatLng(37.785598, -122.394715),
  new google.maps.LatLng(37.785321, -122.394361),
  new google.maps.LatLng(37.785207, -122.394236),
  new google.maps.LatLng(37.785751, -122.394062),
  new google.maps.LatLng(37.785996, -122.393881),
  new google.maps.LatLng(37.786092, -122.393830),
  new google.maps.LatLng(37.785998, -122.393899),
  new google.maps.LatLng(37.785114, -122.394365),
  new google.maps.LatLng(37.785022, -122.394441),
  new google.maps.LatLng(37.784823, -122.394635),
  new google.maps.LatLng(37.784719, -122.394629),
  new google.maps.LatLng(37.785069, -122.394176),
  new google.maps.LatLng(37.785500, -122.393650),
  new google.maps.LatLng(37.785770, -122.393291),
  new google.maps.LatLng(37.785839, -122.393159),
  new google.maps.LatLng(37.782651, -122.400628),
  new google.maps.LatLng(37.782616, -122.400599),
  new google.maps.LatLng(37.782702, -122.400470),
  new google.maps.LatLng(37.782915, -122.400192),
  new google.maps.LatLng(37.783137, -122.399887),
  new google.maps.LatLng(37.783414, -122.399519),
  new google.maps.LatLng(37.783629, -122.399237),
  new google.maps.LatLng(37.783688, -122.399157),
  new google.maps.LatLng(37.783716, -122.399106),
  new google.maps.LatLng(37.783798, -122.399072),
  new google.maps.LatLng(37.783997, -122.399186),
  new google.maps.LatLng(37.784271, -122.399538),
  new google.maps.LatLng(37.784577, -122.399948),
  new google.maps.LatLng(37.784828, -122.400260),
  new google.maps.LatLng(37.784999, -122.400477),
  new google.maps.LatLng(37.785113, -122.400651),
  new google.maps.LatLng(37.785155, -122.400703),
  new google.maps.LatLng(37.785192, -122.400749),
  new google.maps.LatLng(37.785278, -122.400839),
  new google.maps.LatLng(37.785387, -122.400857),
  new google.maps.LatLng(37.785478, -122.400890),
  new google.maps.LatLng(37.785526, -122.401022),
  new google.maps.LatLng(37.785598, -122.401148),
  new google.maps.LatLng(37.785631, -122.401202),
  new google.maps.LatLng(37.785660, -122.401267),
  new google.maps.LatLng(37.803986, -122.426035),
  new google.maps.LatLng(37.804102, -122.425089),
  new google.maps.LatLng(37.804211, -122.424156),
  new google.maps.LatLng(37.803861, -122.423385),
  new google.maps.LatLng(37.803151, -122.423214),
  new google.maps.LatLng(37.802439, -122.423077),
  new google.maps.LatLng(37.801740, -122.422905),
  new google.maps.LatLng(37.801069, -122.422785),
  new google.maps.LatLng(37.800345, -122.422649),
  new google.maps.LatLng(37.799633, -122.422603),
  new google.maps.LatLng(37.799750, -122.421700),
  new google.maps.LatLng(37.799885, -122.420854),
  new google.maps.LatLng(37.799209, -122.420607),
  new google.maps.LatLng(37.795656, -122.400395),
  new google.maps.LatLng(37.795203, -122.400304),
  new google.maps.LatLng(37.778738, -122.415584),
  new google.maps.LatLng(37.778812, -122.415189),
  new google.maps.LatLng(37.778824, -122.415092),
  new google.maps.LatLng(37.778833, -122.414932),
  new google.maps.LatLng(37.778834, -122.414898),
  new google.maps.LatLng(37.778740, -122.414757),
  new google.maps.LatLng(37.778501, -122.414433),
  new google.maps.LatLng(37.778182, -122.414026),
  new google.maps.LatLng(37.777851, -122.413623),
  new google.maps.LatLng(37.777486, -122.413166),
  new google.maps.LatLng(37.777109, -122.412674),
  new google.maps.LatLng(37.776743, -122.412186),
  new google.maps.LatLng(37.776440, -122.411800),
  new google.maps.LatLng(37.776295, -122.411614),
  new google.maps.LatLng(37.776158, -122.411440),
  new google.maps.LatLng(37.775806, -122.410997),
  new google.maps.LatLng(37.775422, -122.410484),
  new google.maps.LatLng(37.775126, -122.410087),
  new google.maps.LatLng(37.775012, -122.409854),
  new google.maps.LatLng(37.775164, -122.409573),
  new google.maps.LatLng(37.775498, -122.409180),
  new google.maps.LatLng(37.775868, -122.408730),
  new google.maps.LatLng(37.776256, -122.408240),
  new google.maps.LatLng(37.776519, -122.407928),
  new google.maps.LatLng(37.776539, -122.407904),
  new google.maps.LatLng(37.776595, -122.407854),
  new google.maps.LatLng(37.776853, -122.407547),
  new google.maps.LatLng(37.777234, -122.407087),
  new google.maps.LatLng(37.777644, -122.406558),
  new google.maps.LatLng(37.778066, -122.406017),
  new google.maps.LatLng(37.778468, -122.405499),
  new google.maps.LatLng(37.778866, -122.404995),
  new google.maps.LatLng(37.779295, -122.404455),
  new google.maps.LatLng(37.779695, -122.403950),
  new google.maps.LatLng(37.779982, -122.403584),
  new google.maps.LatLng(37.780295, -122.403223),
  new google.maps.LatLng(37.780664, -122.402766),
  new google.maps.LatLng(37.781043, -122.402288),
  new google.maps.LatLng(37.781399, -122.401823),
  new google.maps.LatLng(37.781727, -122.401407),
  new google.maps.LatLng(37.781853, -122.401247),
  new google.maps.LatLng(37.781894, -122.401195),
  new google.maps.LatLng(37.782076, -122.400977),
  new google.maps.LatLng(37.782338, -122.400603),
  new google.maps.LatLng(37.782666, -122.400133),
  new google.maps.LatLng(37.783048, -122.399634),
  new google.maps.LatLng(37.783450, -122.399198),
  new google.maps.LatLng(37.783791, -122.398998),
  new google.maps.LatLng(37.784177, -122.398959),
  new google.maps.LatLng(37.784388, -122.398971),
  new google.maps.LatLng(37.784404, -122.399128),
  new google.maps.LatLng(37.784586, -122.399524),
  new google.maps.LatLng(37.784835, -122.399927),
  new google.maps.LatLng(37.785116, -122.400307),
  new google.maps.LatLng(37.785282, -122.400539),
  new google.maps.LatLng(37.785346, -122.400692),
  new google.maps.LatLng(37.765769, -122.407201),
  new google.maps.LatLng(37.765790, -122.407414),
  new google.maps.LatLng(37.765802, -122.407755),
  new google.maps.LatLng(37.765791, -122.408219),
  new google.maps.LatLng(37.765763, -122.408759),
  new google.maps.LatLng(37.765726, -122.409348),
  new google.maps.LatLng(37.765716, -122.409882),
  new google.maps.LatLng(37.765708, -122.410202),
  new google.maps.LatLng(37.765705, -122.410253),
  new google.maps.LatLng(37.765707, -122.410369),
  new google.maps.LatLng(37.765692, -122.410720),
  new google.maps.LatLng(37.765699, -122.411215),
  new google.maps.LatLng(37.765687, -122.411789),
  new google.maps.LatLng(37.765666, -122.412373),
  new google.maps.LatLng(37.765598, -122.412883),
  new google.maps.LatLng(37.765543, -122.413039),
  new google.maps.LatLng(37.765532, -122.413125),
  new google.maps.LatLng(37.765500, -122.413553),
  new google.maps.LatLng(37.765448, -122.414053),
  new google.maps.LatLng(37.765388, -122.414645),
  new google.maps.LatLng(37.765323, -122.415250),
  new google.maps.LatLng(37.765303, -122.415847),
  new google.maps.LatLng(37.765251, -122.416439),
  new google.maps.LatLng(37.765204, -122.417020),
  new google.maps.LatLng(37.765172, -122.417556),
  new google.maps.LatLng(37.765164, -122.418075),
  new google.maps.LatLng(37.765153, -122.418618),
  new google.maps.LatLng(37.765136, -122.419112),
  new google.maps.LatLng(37.765129, -122.419378),
  new google.maps.LatLng(37.765119, -122.419481),
  new google.maps.LatLng(37.765100, -122.419852),
  new google.maps.LatLng(37.765083, -122.420349),
  new google.maps.LatLng(37.765045, -122.420930),
  new google.maps.LatLng(37.764992, -122.421481),
  new google.maps.LatLng(37.764980, -122.421695),
  new google.maps.LatLng(37.764993, -122.421843),
  new google.maps.LatLng(37.764986, -122.422255),
  new google.maps.LatLng(37.764975, -122.422823),
  new google.maps.LatLng(37.764939, -122.423411),
  new google.maps.LatLng(37.764902, -122.424014),
  new google.maps.LatLng(37.764853, -122.424576),
  new google.maps.LatLng(37.764826, -122.424922),
  new google.maps.LatLng(37.764796, -122.425375),
  new google.maps.LatLng(37.764782, -122.425869),
  new google.maps.LatLng(37.764768, -122.426089),
  new google.maps.LatLng(37.764766, -122.426117),
  new google.maps.LatLng(37.764723, -122.426276),
  new google.maps.LatLng(37.764681, -122.426649),
  new google.maps.LatLng(37.782012, -122.404200),
  new google.maps.LatLng(37.781574, -122.404911),
  new google.maps.LatLng(37.781055, -122.405597),
  new google.maps.LatLng(37.780479, -122.406341),
  new google.maps.LatLng(37.779996, -122.406939),
  new google.maps.LatLng(37.779459, -122.407613),
  new google.maps.LatLng(37.778953, -122.408228),
  new google.maps.LatLng(37.778409, -122.408839),
  new google.maps.LatLng(37.777842, -122.409501),
  new google.maps.LatLng(37.777334, -122.410181),
  new google.maps.LatLng(37.776809, -122.410836),
  new google.maps.LatLng(37.776240, -122.411514),
  new google.maps.LatLng(37.775725, -122.412145),
  new google.maps.LatLng(37.775190, -122.412805),
  new google.maps.LatLng(37.774672, -122.413464),
  new google.maps.LatLng(37.774084, -122.414186),
  new google.maps.LatLng(37.773533, -122.413636),
  new google.maps.LatLng(37.773021, -122.413009),
  new google.maps.LatLng(37.772501, -122.412371),
  new google.maps.LatLng(37.771964, -122.411681),
  new google.maps.LatLng(37.771479, -122.411078),
  new google.maps.LatLng(37.770992, -122.410477),
  new google.maps.LatLng(37.770467, -122.409801),
  new google.maps.LatLng(37.770090, -122.408904),
  new google.maps.LatLng(37.769657, -122.408103),
  new google.maps.LatLng(37.769132, -122.407276),
  new google.maps.LatLng(37.768564, -122.406469),
  new google.maps.LatLng(37.767980, -122.405745),
  new google.maps.LatLng(37.767380, -122.405299),
  new google.maps.LatLng(37.766604, -122.405297),
  new google.maps.LatLng(37.765838, -122.405200),
  new google.maps.LatLng(37.765139, -122.405139),
  new google.maps.LatLng(37.764457, -122.405094),
  new google.maps.LatLng(37.763716, -122.405142),
  new google.maps.LatLng(37.762932, -122.405398),
  new google.maps.LatLng(37.762126, -122.405813),
  new google.maps.LatLng(37.761344, -122.406215),
  new google.maps.LatLng(37.760556, -122.406495),
  new google.maps.LatLng(37.759732, -122.406484),
  new google.maps.LatLng(37.758910, -122.406228),
  new google.maps.LatLng(37.758182, -122.405695),
  new google.maps.LatLng(37.757676, -122.405118),
  new google.maps.LatLng(37.757039, -122.404346),
  new google.maps.LatLng(37.756335, -122.403719),
  new google.maps.LatLng(37.755503, -122.403406),
  new google.maps.LatLng(37.754665, -122.403242),
  new google.maps.LatLng(37.753837, -122.403172),
  new google.maps.LatLng(37.752986, -122.403112),
  new google.maps.LatLng(37.751266, -122.403355)
];

//Ashley: Made changes for generating Heat Map
function mapsInitialize(targetID) {
    var myLatlng = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
        zoom: 3,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.SATELLITE  
    };
    map = new google.maps.Map(document.getElementById(targetID), mapOptions);
	
	pointArray = new google.maps.MVCArray(taxiData);
	
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: pointArray,
		radius:20,
        visible:true, 
        opacity:60
	});

	heatmap.setMap(map);
}