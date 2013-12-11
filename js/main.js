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
redoMapData

*/
// Change this to adjust the date range we are using. Will need to change var BW (bar width) if the date range gets long enough.
var startYear = 1981; 
var myUFOs = [],

polygonCoords = new Array(), //Ashley: New Array to store the Polygon Co-Ordinates
tempPolygonCoords = new Array(), //Ashley: New Array to temporarily store the Polygon Co-Ordinates
stateObject = {}, //Ashley: New Object to store the State information
stateList = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"], //Ashley: New Array of the abbreviated list of States
stateMapper = {"Alabama": "AL","Alaska": "AK","Arizona": "AZ","Arkansas": "AR","California": "CA","Colorado": "CO","Connecticut": "CT","Delaware": "DE","WashingtonDC": "DC","Florida": "FL","Georgia": "GA","Hawaii": "HI","Idaho": "ID","Illinois": "IL","Indiana": "IN","Iowa": "IA","Kansas": "KS","Kentucky": "KY","Louisiana": "LA","Maine": "ME","Maryland": "MD","Massachusetts": "MA","Michigan": "MI","Minnesota": "MN","Mississippi": "MS","Missouri": "MO","Montana": "MT","Nebraska": "NE","Nevada": "NV","New Hampshire": "NH","New Jersey": "NJ","New Mexico": "NM","New York": "NY","North Carolina": "NC","North Dakota": "ND","Ohio": "OH","Oklahoma": "OK","Oregon": "OR","Pennsylvania": "PA","Rhode Island": "RI","South Carolina": "SC","South Dakota": "SD","Tennessee": "TN","Texas": "TX","Utah": "UT","Vermont": "VT","Virginia": "VA","Washington": "WA","West Virginia": "WV","Wisconsin": "WI","Wyoming": "WY"}, //Ashley: New Object to map the abbreviated State Name with the Long Name.
stateColor, //Ashley: New Variable to store the state color on the map
stateSightings = {}, //Ashley: New Object to store the State and Sightings information.
mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -95.712891),
    mapTypeId: google.maps.MapTypeId.ROADMAP
}, //Ashley: Initial Map Object Options
map = new google.maps.Map(document.getElementById("map-container"), mapOptions); //Ashley: New Map Object

$(document).ready(function(){
        $("#start-year").text(startYear);
<<<<<<< HEAD
				
=======
        // show the loading animation while the main chart loads
        $("#loading-chart").show();
        $("#beam_wrapper").animate({"height":"33px"},3000);
>>>>>>> 4c6eafe035813a8ba82e15c27b96dd4773815a8e
        $.ajax({
                url: "http://ufo.quast.li/backend/graph.php",
                success: function(data) {
                    $("#loading-chart").hide();
                    prepareData(data);
                },
                error: function(e){console.log("error: " + e);}
        });

        $.ajax({
                url: "http://ufo.quast.li/backend/mapper.php",
                success: mapData,
                error: function(e){console.log("error: " + e);}
        });
		$("#saucer2").animate({"opacity":"1"},1000);
		$("#beam_wrapper").delay(3000).animate({"opacity":"1"},100);
		$("#i").delay(3000).animate({"height":"33px"},4000);
});

function displayTimeline(pointLocations){
    var events = [];
    //console.log(pointLocations);
    $.getJSON( "documents/events.json", function( eventdata ) {
            $.each( eventdata, function( key, val ) {
                    var event = [key, val];
                    thisMonth = val["month"];
                    thisYear = val["year"];
                    thisType = val["type"]
                    iconUrl = ""
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

            // show the loading animation in the sidebar
            $("svg#month-visualization").empty();
            $("#loading-sidebar").show();

            $('svg#visualization').children("rect").attr("fill", "#b34100"); // make all bars red

            $('.event-icon-pointer').hide().delay(400).css({"left": pointerXPos}).fadeIn(800);
            $('.event-icon-up-pointer').hide().delay(400).css({"left": pointerXPos}).fadeIn(800);

            $(this).siblings().removeClass("active").children('.event-icon-pointer').fadeOut("slow");
            $(this).siblings().children('.event-icon-up-pointer').fadeOut("slow");
            $(this).addClass("active");
            $("#timeline").animate({"height": "200px"}, 400);
            $("#chart").animate({"height": "540px"}, 400);

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

            // TODO - Inspect bug when clicking a bunch of times
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
                            var markerleft = (parseInt(thisBarXCoord) - 20) + "px";
                            var markertop = 250 - (thisBarHeight) - 23 + "px";
                            var v = moment([thisEventYear, thisEventMonth]);
                            var displayDate = v.format("MMM YYYY");        
                            var markertxt = "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+thisMonthSightings+"</strong></div>";

                            $(".month-marker").html(markertxt).css({"left" : markerleft, "top" : markertop}).show();

                            displayDetailsHeader(thisEventYear, parseInt(thisEventMonth)+1, thisMonthSightings); 
                            displayDetails(data);
                            prepareMonthData(data, thisEventYear, parseInt(thisEventMonth)+1);

                            $("#loading-sidebar").hide();
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
            $("#chart").delay(400).animate({"height": "400px"}, 400);

            $(this).removeClass("active");
    });

    $("#timeline-infobar").on("click", ".close", function() {

            $('.event-icon-pointer').hide();
            $('.event-icon-up-pointer').hide();

            $("#timeline-infobar").fadeOut(400);
            $("#timeline").delay(400).animate({"height": "48px"}, 400);
            $("#chart").delay(400).animate({"height": "400px"}, 400);

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
    fullSightingObject = {};
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .on("click", function(d, i) {

            // show the loading animation in the sidebar
            $("svg#month-visualization").empty();
            $("#loading-sidebar").show();

            // run when user clicks on a bar in the chart. 
            //populate sidebar with details on this month's sightings.
            var dataString = 'month='+d.month+'&year='+d.year;

            $.ajax({
                url: "http://ufo.quast.li/backend/ufoMapper.php",
                data: dataString,
                success: function(data) {

                    $("#loading-sidebar").hide();

                    displayDetailsHeader(d.year, d.month, d.sightings); 
                    displayDetails(data);
                    prepareMonthData(data, d.year, d.month);
                },
                error: function(e){console.log("error: " + e);}
            });
        })      
        .attr({
            "width": BW,
            "height": 0,
            "x": function(d, i) {
                thisX = 40 + i*BTW;
                thisPointLocation = [d.year, d.month, i*BTW];
                pointLocations.push(thisPointLocation);
                return thisX;

            },
            "y": function(d, i) {

                return h - 20;
            },
            "desc": function(d, i) {
                var v = moment([d.year, d.month-1]);
                var displayDate = v.format("MMMM YYYY");
                //console.log(d);   
                //adding sighting numbers to array
                sightingsArray.push(d.sightings);
                //finding the previous month's sightings
                prevSighting = sightingsArray[sightingsArray.length-2];
                //% change
                pChange = (((d.sightings-prevSighting)/prevSighting)*100).toFixed(2);
                if (pChange == "Infinity"){
                        pChangeText = "<strong>+&#8734;</strong>% from<br>Previous Month";
                    } else if (pChange > 0) {
                        pChangeText = "<strong>+"+Math.abs(pChange)+"</strong>% from<br>Previous Month";
                    } else if (pChange < 0) {
                        pChangeText = "<strong>-"+Math.abs(pChange)+"</strong>% from<br>Previous Month";
                    } else {
                        pChangeText = "No change from<br>Previous Month";
                    }

                    var descString = "<div class='title'>"+displayDate+"</div><div class='title'><strong>"+d.sightings+"</strong> UFOs Reported</div>";

                    if (pChange != "NaN"){
                        descString += "<div class='description'>"+pChangeText+"</div>"; 
                    }

                    return descString;
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

        .transition()
        .attr({
            "height": function(d, i) {
                return yScale(d.sightings);
            },
            "y": function(d, i) {
                return h - 20 - yScale(d.sightings);
            }       
        })
        .duration(1200) 

        //Changing color of the rect when clicked, adding month-marker popup
        $(".bar").click(function() {
                $(this).siblings().attr("fill", "#b34100");
                $(this).attr("fill", "#FFD573"); // Yellow highlight
                
                //Setting the marker text and location
                var markertxt = $(this).attr("markerdesc");
                //var markerleft = ($(this).position().left - 31) + "px";              
                var markerleft = parseInt($(this).attr("x"))-20;

                var markertop = h - ($(this).attr("height")) - 23 + "px";
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
                function(event) {
                        var y = parseFloat($(this).attr("y")) + 0;
                        $(this).css("opacity", "0.6").attr("y", y);

                        
                        //Setting the info-text
                        var txt = $(this).attr("desc");
                        //var left = $(this).position().left - 60;
                        var left = (event.pageX + 4) + "px";  
                        //var top = h - 50;
                        var top = (event.pageY - 70) + "px"; 
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
        Object.keys(stateSightings).length = 0; //Clear the stateSightings Object
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
                thisSightingHTML += "<div class='link' onMouseOver='this.style.opacity=1' onMouseOut='this.style.opacity=.4'><a class='sighting-item-link' href='"+json[i]["url"]+"' target='_new'>More details<img src='images/icons/external_link.png' height='10px' width='10px' style='border: none;padding-left:2px;'></a></div></div>";

                $("#sighting-list").append("<li>"+thisSightingHTML+"</li>");
                
                if($.inArray(json[i]["state"], stateList) !== -1){
                    if(json[i]["state"] in stateSightings){
                        stateSightings[json[i]["state"]]++;
                    } else{
                        stateSightings[json[i]["state"]] = 1;
                    }
                }
        }
        redoMapData(data);
}

function displayDayDetails(data, day){
        Object.keys(stateSightings).length = 0; //Clear the stateSightings Object
        stateSightings = {"":""};
        
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
                        
                        if($.inArray(json[i]["state"], stateList) !== -1){
                            if(json[i]["state"] in stateSightings){
                                stateSightings[json[i]["state"]]++;
                            } else{
                                stateSightings[json[i]["state"]] = 1;
                            }
                        }

                }
        }

        redoMapData(data);

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
        sightingsArray2 = []; //this array collects all sightings values for all months to be later used for finding % increase/decrease
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
                                //adding sighting numbers to array
                                sightingsArray2.push(d.sightings);
                                //finding the previous month's sightings
                                prevSighting2 = sightingsArray2[sightingsArray2.length-2];
                                //% change
                                pChange2 = (((d.sightings-prevSighting2)/prevSighting2)*100).toFixed(2);
                                if (pChange2 == "Infinity"){
                                        pChangeText2 = "<strong>+&#8734;</strong>% from Previous Day";
                                } else if (pChange2 > 0) {
                                        pChangeText2 = "<strong>+"+Math.abs(pChange2)+"</strong>% from Previous Day";
                                } else if (pChange2 < 0) {
                                        pChangeText2 = "<strong>-"+Math.abs(pChange2)+"</strong>% from Previous Day";
                                } else {
                                        pChangeText2 = "No change from Previous Day";
                                }


                                var descString = "<div class='title'>"+displayDate+"</div><div class='description'><strong>"+d.sightings+"</strong> UFOs Reported</div>";


                                if (pChange2 != "NaN"){
                                        descString += "<div class='description'>"+pChangeText2+"</div>";        
                                }

                                return descString;
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

        });

        //Animating the rects of the diagrams on hover
        $(".smallbar").hover(
                function(event) {
                        var y = parseFloat($(this).attr("y")) + 0;
                        $(this).css("opacity", "0.6").attr("y", y);

                        
                        //Setting the info-text
                        var txt = $(this).attr("desc");
                        //var left = $(this).position().left - 60;
                        var left = (event.pageX + 4) + "px"; 
                        //var top = h - 50;
                        var top = (event.pageY - 60) + "px"; 
                        $(".sidebar-info").html(txt).css({"left" : left, "top" : top}).show();
                }, 
                function() {
                        var y = parseFloat($(this).attr("y")) - 0;
                        $(this).css("opacity", "1").attr("y", y);
                        $(".sidebar-info").hide();

                }
        );

}


//Ashley: Method to initialize the Map on load
function mapData(data){

    var maxValue = 0,
        minValue = 0,
        sightingsNumbers = [];  
    var json = JSON.parse( data );
    for (var i = 0; i < json.length; i++) {
        
        var state = json[i]["name"];
        var sightings = json[i]["sightings"];
        
        if($.inArray(state, stateList) !== -1){
            stateSightings[state] = sightings;
            sightingsNumbers.push(sightings);
        }
    }
    maxValue = Math.max.apply(Math,sightingsNumbers);
    minValue = Math.min.apply(Math,sightingsNumbers);
    for(var key in stateSightings){     
        stateSightings[key] = ((stateSightings[key] - minValue)/(maxValue - minValue))*.9;
    }

    $.getJSON( "documents/stateBoundaries.json", function( data ) {
        $.each( data, function( key, value ) {
            var color = "#" + Math.floor(Math.random()*16777215).toString(16);
            for (var i = 0; i < value.length; i++){
                var coords = new google.maps.LatLng(value[i][0], value[i][1]);
                tempPolygonCoords.push(coords);
            }
            stateColor = new google.maps.Polygon({
                paths: tempPolygonCoords,
                strokeColor: "#333",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#b34100",
                fillOpacity: stateSightings[stateMapper[key]]
            }); 
            stateColor.setMap(map);
            stateObject[key] = tempPolygonCoords;
            polygonCoords.push(tempPolygonCoords);
            tempPolygonCoords = [];
        }); 
        
    }); 
}

//Ashley: Method to redraw the Map on click of rect in main bar graph
function redoMapData(data){
    stateColor.setMap(null);
    var maxValue = 0,
        minValue = 0,
        sightingsNumbers = [],
        mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(37.09024, -95.712891),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-container"), mapOptions);

    
    var json = JSON.parse( data );
    for(var key in stateSightings){
        sightingsNumbers.push(stateSightings[key]);
    }
    
    maxValue = Math.max.apply(Math,sightingsNumbers);
    minValue = Math.min.apply(Math,sightingsNumbers);
    
    for(var key in stateSightings){
        stateSightings[key] = ((stateSightings[key] - minValue)/(maxValue - minValue))*.9;
    }

    $.getJSON( "documents/stateBoundaries.json", function( data ) {
        $.each( data, function( key, value ) {
            if(stateMapper[key] in stateSightings){
                var color = "#" + Math.floor(Math.random()*16777215).toString(16);
                for (var i = 0; i < value.length; i++){
                    var coords = new google.maps.LatLng(value[i][0], value[i][1]);
                    tempPolygonCoords.push(coords);
                }
                stateColor = new google.maps.Polygon({
                    paths: tempPolygonCoords,
                    strokeColor: "#333",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: "#b34100",
                    fillOpacity: stateSightings[stateMapper[key]]
                }); 
                stateColor.setMap(map);
                stateObject[key] = tempPolygonCoords;
                polygonCoords.push(tempPolygonCoords);
                tempPolygonCoords = [];
            }
        }); 
    }); 
}

