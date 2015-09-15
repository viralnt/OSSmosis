

//global variables so that they can be passed to animate event
var data;
var vis;
var lineFunc;
var g;
var width, height, padding ;
var dateFormat = d3.time.format("%Y-%m-%d");
var xScale;
var yScale;
var existingChartType;

function createStaticContent(){
		width = 900,   // width of svg
	    height = 500 ,  // height of svg
	    padding = 100;
		 		
		fetchData(); //variable data has been filled with yahho stubbed response 	
		
}

function parseResponseData(){
	//var parseDate = d3.time.format.utc("%d-%b-%y").parse;
	
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	
	 data.forEach(function(d) {
		    d.Date = parseDate(d.Date);
		    
		  });
}

function buildQuery(){
   
     var url = "amzn-data-v2.json";
     return url;
}

function fetchData(){
	
	 var url = buildQuery();
	 
	 var request = $.ajax({
		    type: 'GET',
		    url: url,
		    crossDomain: true,
		    dataType: "json",
		    xhrFields: {
		        withCredentials: false
		    },
		    success: function(responseData, textStatus, jqXHR) {		        
		    	
		    	 data = responseData.query.results.quote;
		    	 
		    	 // initially the above fetched data is in random format. so sort it out.
		    	 data = data.sort(function(x, y){ return dateFormat.parse(x.Date).getTime() - dateFormat.parse(y.Date).getTime(); });	
		    	 
		    	 parseResponseData();

		    	 existingChartType = "LineChart" ;//This AJAX url is called only onload page, hence we draw here line chart so
		    	 drawChart();
		    	 
		    },
		    error: function (responseData, textStatus, errorThrown) {
		    	console.log('*******************failure' + textStatus + "  " + errorThrown);
		    	return;
		    }
	  });    	  
}

function  parseDate2(){
	
}

function drawChart(){
	
	var x_domain = d3.extent(data, function(d) { return d.Date; }),
	y_domain = d3.extent(data, function(d) { return d.Close; });

	
	var  date_format = d3.time.format("%d %b");
	
	
	 vis = d3.select("body")
	 	.append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart")
        ;
	 
	
	     yScale = d3.scale.linear()
	        .domain(y_domain).nice()   
		.range([height - padding, padding]);   
		    
		
	     xScale = d3.time.scale()
	    .domain(x_domain)    
	    .range([padding, width - padding]); 
	    
	    
	 // define the y axis
	    var yAxis = d3.svg.axis()
	        .orient("left")
	        .scale(yScale);
	    
	    // define the x axis
	    var xAxis = d3.svg.axis()
	        .orient("bottom")
	        .scale(xScale)
	        .tickFormat(date_format);
	    
	    vis.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate("+padding+",0)")
	    .call(yAxis);
	    
	    vis.append("g")
	    .attr("class", "xaxis axis")  
	    .attr("transform", "translate(0," + (height - padding) + ")")
	    .call(xAxis);
	    
	    vis.selectAll(".xaxis text")  
	    .attr("transform", function(d) {
	       return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
	   });
	    
	    vis.append("text")
	    .attr("text-anchor", "middle")  
	    .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  
	    .text("Value");
	    
	    vis.append("text")
	    .attr("text-anchor", "middle")  
	    .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")  
	    .text("Date");
	    
	    /********************
	     * Line Chart draws here
	     */
	    
	    //Remove other existing charts
	    //d3.select(".lineChart").remove();
	    
	    buildLineChart();
	  /* lineFunc = d3.svg.line()
	    .x(function(d, i) {
	  	  return xScale(d.Date);
	    })
	    .y(function(d, i) {        	  
	  	  return yScale(d.Close);
	    })
	    .interpolate('linear');
		
	    g = vis.append("svg:g");
	    
	    g.append("svg:path").attr("d", lineFunc(data)).attr('stroke', 'blue')
	    .attr('stroke-width', 1)
	    .attr('fill', 'none')
	    .attr("class", "lineChart");*/
}

function onLoadCallback(){
	
	createStaticContent();
	
//	drawChart();
	
	
	  $("#CandleStickChart").click(function()
	   	    	{	   	    	
		  buildChartCandleStick('CandleStickChart');
	   	     });
	  
	  $("#LineChart").click(function()
	   	    	{	   	    	
		  buildLineChart('LineChart');
	   	     });
	  
	  $("#OHLChart").click(function()
	   	    	{	   	    	
		  buildChartOHLC('LineChart');
	   	     });
	
}

function min(a, b){ return a < b ? a : b ; }
 
function max(a, b){ return a > b ? a : b; }   

function buildLineChart(){
	
	 d3.selectAll(".graphAlreadyDrawn").remove();
	 
	  lineFunc = d3.svg.line()
	    .x(function(d, i) {
	  	  return xScale(d.Date);
	    })
	    .y(function(d, i) {        	  
	  	  return yScale(d.Close);
	    })
	    .interpolate('linear');
		
	    g = vis.append("svg:g");
	    
	    g.append("svg:path").attr("d", lineFunc(data)).attr('stroke', 'blue')
	    .attr('stroke-width', 1)
	    .attr('fill', 'none')
	    .attr("class", "lineChart");
}

function buildChartCandleStick(){
	
	
	 //Remove other existing charts
	d3.selectAll(".graphAlreadyDrawn").remove();
    d3.select(".lineChart").remove();
   
	var margin = 10;
  vis.selectAll("rect")
  .data(data)
  .enter().append("svg:rect")
  .attr("x", function(d) { return xScale(d.Date); })
  .attr("y", function(d) {return yScale(max(d.Open, d.Close)) ;})		  
  .attr("height", function(d) { return yScale(min(d.Open, d.Close))-yScale(max(d.Open, d.Close));})
  //.attr("width", function(d) { return 0.5 * (width - 2*margin)/data.length; })
  .attr("width", function(d) { return margin; })
  .attr("fill",function(d) { return d.Open > d.Close ? "red" : "green" ;})
  .attr("class", "graphAlreadyDrawn");

   vis.selectAll("line.stem")
    .data(data)
    .enter().append("svg:line")
    .attr("class", "stem")
    .attr("x1", function(d) { return xScale(d.Date) + 0.25 * margin ;})
    .attr("x2", function(d) { return xScale(d.Date) + 0.25 * margin ;})		    
    .attr("y1", function(d) { return yScale(d.High);})
    .attr("y2", function(d) { return yScale(d.Low); })
    .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
    .attr("class", "graphAlreadyDrawn");
  

 // existingChartType = "CandleStickChart";
}

function buildChartOHLC(){
	   		 
   		d3.selectAll(".graphAlreadyDrawn").remove();
   		d3.select(".lineChart").remove();
	
	/* High - Close vertical line startz */
   		
   		var margin = 20;
    
   		vis.selectAll("line.stem4")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "stem4")
      .attr("x1", function(d) { return xScale(d.Date) + 0.25 * margin ;})
      .attr("x2", function(d) { return xScale(d.Date) + 0.25 * margin ;})		    
      .attr("y1", function(d) { return yScale(d.High);})
      .attr("y2", function(d) { return yScale(d.Low); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 2)
      .attr("class", "graphAlreadyDrawn");
       
   /* High - Close vertical line endz */    

       
       /* High - Close Open-Close line startz */
       
   		vis.selectAll("line.stem2")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "stem2")
      .attr("x1", function(d) { return xScale(d.Date) + 0.25 * margin ;})
      .attr("x2", function(d) { return xScale(d.Date) + 0.75 * margin ;})		    
      .attr("y1", function(d) { return yScale(d.Close);})
      .attr("y2", function(d) { return yScale(d.Close); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 1)
      .attr("class", "graphAlreadyDrawn");
      
      
   		vis.selectAll("line.stem3")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "stem3")
      .attr("x1", function(d) { return xScale(d.Date) + 0.25 * margin ;})
      .attr("x2", function(d) { return xScale(d.Date) - 0.5 * margin ;})		    
      .attr("y1", function(d) { return yScale(d.Open);})
      .attr("y2", function(d) { return yScale(d.Open); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 1)
      .attr("class", "graphAlreadyDrawn");

	/* High - Close Open-Close line endz */
      
      existingChartType = "OHLCChart";
}


function parseNewResponseData(dTemp){
	//var parseDate = d3.time.format.utc("%d-%b-%y").parse;
	
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	
	dTemp.forEach(function(d) {
		    d.Date = parseDate(d.Date);
		    
		  });
	
	return dTemp;
}


var animateCounter = 1;
function startAnimation(){	
	
	data.shift();
	
	var dTemp;
	
	// call real time data ...
	 //Create stomp client over sockJS protocol
    var socket = new SockJS("api/ws");
    var stompClient = Stomp.over(socket);
    
    // Render price data from server into HTML, registered as callback
    // when subscribing to price topic
    function renderPrice(frame) {
    	animateCounter = animateCounter + 1;
    	if(animateCounter > 30 ) return;
    	 var stockPrices = JSON.parse(frame.body);
		 //alert(stockPrices);
    	 dTemp = parseNewResponseData(stockPrices);
    	 data.push(dTemp[0]);
		 d3.select(".chart").remove();
		drawChart();	
    }
    
 // Callback function to be called when stomp client is connected to server
    var connectCallback = function() {
      stompClient.subscribe('/topic/price', renderPrice);
    }; 

    // Callback function to be called when stomp client could not connect to server
    var errorCallback = function(error) {
      alert(error.headers.message);
    };

    // Connect to server via websocket
    stompClient.connect("guest", "guest", connectCallback, errorCallback);  
	
	
	
}
/*
function animate2(){
	 setInterval(startAnimation,1000);
}*/