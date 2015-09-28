//global variables so that they can be passed to animate event. Actually the code should be modular without any global variable.
var data;
var svgContainer;
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
				
	   fetchDataAndDrawLineChart(); //variable data has been filled with yahho stubbed response 	
		
}

function parseResponseData(){

	var parseDate = d3.time.format("%Y-%m-%d").parse;
	
	data.forEach(function(d) {
		console.log(d.Date);
		   d.Date = parseDate(d.Date);
		   
		 });
}

function buildQuery(){
   
	var url = "http://localhost:8080/stockticker/amzn-data-v2.json";

	return url;
}

function fetchDataAndDrawLineChart(){
	
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
		   	 sortChartData();
		   	 
		   	 // parse the response and modify the date/time values with d3 parser
		   	 parseResponseData();

		   	//This AJAX url is called only onload page, and at page onload we draw here line chart
		   	 drawChartPlot();
		   	 buildLineChart();
		   	 
		   },
		   error: function (responseData, textStatus, errorThrown) {
		   	console.log('*******************failure' + textStatus + "  " + errorThrown);
		   	return;
		   }
	 });    	  
}


function onLoadCallback(){
	
	createStaticContent();
		
	 $("#CandleStickChart").click(function()
	  	   	{	   	   	
		 buildChartCandleStick('CandleStickChart');
	  	    });
	 
	 $("#btnCandleStickChart").click(function()
	  	   	{	   	   
		 $("#btnChartTitle").html($("#btnCandleStickChart").text() + " <span class='caret'></span>");
		 buildChartCandleStick('CandleStickChart');
	  	    });
	 
	 
	 $("#LineChart").click(function()
	  	   	{	   	   	
		 buildLineChart('LineChart');
	  	    });
	 $("#btnLineChart").click(function()
	  	   	{	   	   	
		 $("#btnChartTitle").html($("#btnLineChart").text() + " <span class='caret'></span>");
		 buildLineChart('LineChart');
	  	    });
	 
	 
	 $("#OHLChart").click(function()
	  	   	{	   	   	
		 buildChartOHLC('LineChart');
	  	    });
	 $("#btnOHLC").click(function()
	  	   	{	   	   	
		 $("#btnChartTitle").html($("#btnOHLC").text() + " <span class='caret'></span>");
		 buildChartOHLC('LineChart');
	  	    });
	 
	 
	 $("#ZoomIn").click(function()
	  	   	{	   	   	
		 zoomIn();
	  	    });
	 
	 $("#ZoomOut").click(function()
	  	   	{	   	   	
		 zoomOut();
	  	    });
	
}

/**
 * Helper functions start here - 4 of them right now
 */
function min(a, b){ return a < b ? a : b ; }
 
function max(a, b){ return a > b ? a : b; }   

function parseNewResponseData(dTemp){
	
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	
	dTemp.forEach(function(d) {
		   d.Date = parseDate(d.Date);
		   
		 });
	
	return dTemp;
}

function sortChartData(){
	
	data = data.sort(
			function(x, y){ 
				return dateFormat.parse(x.Date).getTime() - dateFormat.parse(y.Date).getTime(); 
				});	
}


/**
 * Main chart functions start here
 * drawChartPlot  buildLineChart  buildChartCandleStick		buildChartOHLC
 * 
 */

function drawChartPlot(){
	
	//The values on x-axis spans all the date values in the data
	var x_domain = d3.extent(data, function(d) { return d.Date; });
	
	var tempExtentData = [];
	data.forEach(function(d) {
		tempExtentData.push(d.High);    tempExtentData.push(d.Low);
		 });
	
	//The values on y-axis spans from lowest stock value to the highest stock value
	var y_domain = d3.extent(tempExtentData);
	
	var  date_format = d3.time.format("%d %b");
	
	svgContainer = d3.select("#chart")
		.append("svg:svg")
        .attr("width", width)
        .attr("height", height)        
        .attr("class", "svgChart")  //adding class attribute so that we can refer the svg container with this attribute.
        ;
	 
	var rectangle = svgContainer.append("rect")
	                           .attr("x", 100)
	                           .attr("y", 100)
	                           .attr("width", 700)
	                           .attr("height", 300);
	 
	 
	//arun we can remove below yScale
	
	    yScale = d3.scale.linear()
	       .domain(y_domain).nice()   
	       .range([height - padding, padding]);   
		   
		
	   xScale = d3.time.scale()
	   		.domain(x_domain)    
	   		.range([padding, width - padding]); 
	    
	    yScaleRight = d3.scale.linear()
	        .domain(y_domain).nice()   
			.range([height - padding, padding]);   

		//arun we can remove below xScaleTop

		xScaleTop = d3.time.scale()
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
	   
	   
	   var yAxisRight = d3.svg.axis()
        .orient("right")
        .scale(yScaleRight);

	   
	   var xAxisTop = d3.svg.axis()
        .orient("top")
        .scale(xScaleTop)
        .tickFormat(date_format);

	   
	   
	  /* Removing y-axis from left as it looks very messy
	   * svgContainer.append("g")
		.attr("class", "axis")
	   .attr("transform", "translate("+padding+",0)")
	   .call(yAxis);*/
	   
	   svgContainer.append("g")
	   .attr("class", "xaxis axis")  
	   .attr("transform", "translate(0," + (height - padding) + ")")
	   .call(xAxis);
	   
	   
	   svgContainer.selectAll(".xaxis text")  
	   .attr("transform", function(d) {
	      return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
	  });
	   
	   svgContainer.append("text")
	   .attr("text-anchor", "middle")  
	   .attr("transform", "translate("+ (width-20) +","+(height/2)+")rotate(-90)")  
	   .text("Value");
	   
	   svgContainer.append("text")
	   .attr("text-anchor", "middle")  
	   .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")  
	   .text("Date");
	   
	   
	   svgContainer.append("g")
		.attr("class", "axis")
	   .attr("transform", "translate("+(width-100)+",0)")
	   .call(yAxisRight);

	   /*
	    * Removing the xAxis at top and the associated ticks as it is giving a messy look
	    * svgContainer.append("g")
	   .attr("class", "xaxisTop axis")  
	   .attr("transform", "translate(0," + 100 + ")")
	   .call(xAxisTop);
	   
	   svgContainer.selectAll(".xaxisTop text")  
	   .attr("transform", function(d) {
	     // return "translate(" + (this.getBBox().height*-2)  + "," + (this.getBBox().height - 24) + ")rotate(-45)";
	   	 return "translate(" + this.getBBox().height  + "," + (this.getBBox().height - 24) + ")rotate(-45)";
	  });*/
	   
	  

	 //horizontal and vertical grid lines here
		svgContainer.selectAll("line.xGrid")
         .data(xScale.ticks(10))
         .enter().append("svg:line")
         .attr("class", "xGrid")
         .attr("x1", xScale)
         .attr("x2", xScale)
         .attr("y1", 100)
         .attr("y2", height - 100)
         .attr("stroke", "#404040");
		 
		svgContainer.selectAll("line.yGrid")
         .data(yScale.ticks(10))
         .enter().append("svg:line")
         .attr("class", "yGrid")
         .attr("x1", 100)
         .attr("x2", width - 100)
         .attr("y1", yScale)
         .attr("y2", yScale)
         .attr("stroke", "#404040");
}


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
		
	   g = svgContainer.append("svg:g");
	   
	   g.append("svg:path").attr("d", lineFunc(data)).attr('stroke', 'green')
	   .attr('stroke-width', 2)
	   .attr('fill', 'none')
	   .attr("class", "lineChart");
	   
	 existingChartType = "LineChart";
}

function buildChartCandleStick(){
	
	
	//Remove other existing charts
	d3.selectAll(".graphAlreadyDrawn").remove();
    d3.select(".lineChart").remove();
   
	var margin = 20;
  svgContainer.selectAll("rect")
  .data(data)
  .enter().append("svg:rect")
  .attr("x", function(d) { return xScale(d.Date) - (0.125 * (width)/data.length); })
  .attr("y", function(d) {return yScale(max(d.Open, d.Close)) ;})		  
  .attr("height", function(d) { return yScale(min(d.Open, d.Close))-yScale(max(d.Open, d.Close));})
  .attr("width", function(d) { return 0.25 * (width)/data.length; })
  //.attr("width", function(d) { return margin; })
  .attr("fill",function(d) { return d.Open > d.Close ? "red" : "green" ;})
  .attr("class", "graphAlreadyDrawn");

   svgContainer.selectAll("line.CandleStick")
    .data(data)
    .enter().append("svg:line")
    .attr("class", "CandleStick")
    .attr("x1", function(d) { return xScale(d.Date)  ;})
    .attr("x2", function(d) { return xScale(d.Date) ;})		    
    .attr("y1", function(d) { return yScale(d.High);})
    .attr("y2", function(d) { return yScale(d.Low); })
    .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
    .attr("class", "graphAlreadyDrawn");
  

  existingChartType = "CandleStickChart";
}

function buildChartOHLC(){
	  		 
   		d3.selectAll(".graphAlreadyDrawn").remove();
   		d3.select(".lineChart").remove();
	
	/* High - Close vertical line startz */
   		
   		var margin = 20;
    
   	  svgContainer.selectAll("line.High-Low")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "High-Low")
      .attr("x1", function(d) { return xScale(d.Date) ;})
      .attr("x2", function(d) { return xScale(d.Date) ;})		    
      .attr("y1", function(d) { return yScale(d.High);})
      .attr("y2", function(d) { return yScale(d.Low); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 2)
      .attr("class", "graphAlreadyDrawn");
       
   /* High - Close vertical line endz */    

       
       /* High - Close Open-Close line startz */
       
   		svgContainer.selectAll("line.Open")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "Open")
      .attr("x1", function(d) { return xScale(d.Date) /*+ 0.25 * margin*/ ;})
      .attr("x2", function(d) { return xScale(d.Date) + 0.50 * margin ;})		    
      .attr("y1", function(d) { return yScale(d.Close);})
      .attr("y2", function(d) { return yScale(d.Close); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 1)
      .attr("class", "graphAlreadyDrawn");
      
      
   		svgContainer.selectAll("line.Close")
      .data(data)
      .enter().append("svg:Close")
      .attr("class", "stem3")
      .attr("x1", function(d) { return xScale(d.Date) - 0.5 * margin ;})
      .attr("x2", function(d) { return xScale(d.Date)  ;})	
      .attr("y1", function(d) { return yScale(d.Open);})
      .attr("y2", function(d) { return yScale(d.Open); })
      .attr("stroke", function(d){ return d.Open > d.Close ? "red" : "green"; })
      .attr('stroke-width', 1)
      .attr("class", "graphAlreadyDrawn");

	/* High - Close Open-Close line endz */
      
      existingChartType = "OHLCChart";
}

var zoomData = [];
function zoomIn(){
	//When you zoom-in you plot less data on the chart. i.e. with each zoom-in click you reduce the number of dates on x-axis
	
	if(data.length > 0)
		zoomData.push(data.shift());
	
	d3.select(".svgChart").remove();	
	drawChartPlot();
	
	if(existingChartType == "OHLCChart")
		buildChartOHLC();
	else if (existingChartType == "CandleStickChart") {
		buildChartCandleStick();
	}else if (existingChartType == "LineChart") {
		buildLineChart();
	}
	
}

function zoomOut(){
	//When you zoom-out you plot more data on the chart. i.e. with each zoom-out click you increase the number of dates on x-axis

	if(zoomData.length > 0)
		data.unshift(zoomData.pop());
	
	d3.select(".svgChart").remove();
	
	drawChartPlot();
	
	if(existingChartType == "OHLCChart")
		buildChartOHLC();
	else if (existingChartType == "CandleStickChart") {
		buildChartCandleStick();
	}else if (existingChartType == "LineChart") {
		buildLineChart();
	}
	
}



var animateCounter = 1;
function startAnimation(){
	
	/**
	* Checking animation with stompjs
	*/
	
	// call real time data ...
	//Create stomp client over sockJS protocol
   var socket = new SockJS("http://localhost:8080/stockticker/api/ws");
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
		d3.select(".svgChart").remove();
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

function animate2(){
	startAnimation();
}
