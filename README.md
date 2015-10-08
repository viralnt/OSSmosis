# streamingchart

A project for demonstrating capabilities in Spring and SockJS to build WebSocket-style messaging applications. In this application, Server component will stream 
 stock price information by Websocket and in client/browser, D3 javascript library uses this data to create different types of moving chart (candle stick,Bar and OHOC).

### Client-side libraries used:

* stomp js : This Spring web project uses STOMP over WebSocket messaging between server and browser.
* SockJS : This application also uses SockJS so that Websocket work for all modern browsers which supports this protocol and in environments which don't support the WebSocket protocol -- for example, behind restrictive corporate proxies.
* d3 js : To create Chart

### Server-side 

Server side component builds by Spring Framework 4.0 and runs on Tomcat 7.0.47+ and . Any Other servlet 3.0 containers can be used.



### Using a Message Broker:

Out of the box, a "simple" message broker Spring in memory is used to send messages (stock information) to subscribers(browser).But in production its recommended to use fully featured STOMP message broker such as RabbitMQ, ActiveMQ.

For RabbitMQ, you have to install STOMP plugin as well along with RabitMQ. For ActiveMQ you need to configure a STOMP transport connnector.
The default settings should work for RabbitMQ and ActiveMQ

## What you’ll build
In this application, a server component that will accept a message carrying a stock code name. In response, it will stream the data for that particular stock into a topic that the client is subscribed to.

In starting, this application will display stock chart based on historical data, later when you click on go live, chart will start moving based on streaming data from websocket.

### Create a message-handling controller and scheduler

In Spring's approach to working with STOMP messaging, STOMP messages can be routed to {AtController}[`@Controller`] classes. For example the `WebSocketController` is mapped to handle messages to destination "/api/" and publish stock info into topic /topic/price

`src/main/java/com/oss/streamingchart/WebSocketController.java`

This is main class of server component, lets discuss each individual component step by step :

The {AtMessageMapping}[`@MessageMapping`] annotation with "/addStock" ensures that if a message is sent with this URI, then the `addStock()` method of this class is called.

The payload of the message is bound to a `StockData` object which is passed into `addStock()` method. 

Internally, the implementation of the method will call updatePriceAndBroadcast() to put the stock data (from mock json file either resources/data/AAPL_Data.json or AMZN_Data.json) in topic. This value is broadcastvia topic to all subscriber to "/topic/price".

There is one scheduler which schedule to execute every second and call  updatePriceAndBroadcast() method to put mock stock data into topic to broadcast to all subscriber to "/topic/price".

### Configure Spring Websocket for STOMP messaging and SockJS

Now the controller and scheduler are created, you can configure Spring to enable Websocket, STOMP and SockJS. In servlet-context.xml file add this below configuration :

  `<websocket:message-broker application-destination-prefix="/app">
    <websocket:stomp-endpoint path="/ws">
      <websocket:sockjs/>
    </websocket:stomp-endpoint>
    <websocket:simple-broker prefix="/topic"/>
  </websocket:message-broker>`
  
  `<websocket:message-broker>` enables Webscoket message handling, backed by a message broker. In this project we have used in memory SimpMessagingTemplate class, but in production its recommended to use either RabbitMQ or ActiveMQ or any other message-broker.
  
  `<websocket:simple-broker>` tag to enable a simple memory-based message broker to carry the stock info back to the client on destinations prefixed with "/topic". It also designates the "/app" prefix for messages that are bound for @MessageMapping-annotated methods.
  
  
  The Spring Framework provides support for using STOMP over WebSocket through the spring-messaging and spring-websocket modules. By this tag `<websocket:stomp-endpoint path="/ws">`, it exposes a STOMP WebSocket/SockJS (<websocket:sockjs/>) endpoint at the URL path /ws where messages whose destination starts with "/app" are routed to message-handling methods (i.e. application work) and messages whose destinations start with "/topic"  will be routed to the message broker (i.e. broadcasting to other connected clients).

### Create a Browser Client 
 
/WEB-INF/home.jsp , this file have functionality to add stock code for which you want server component to publish stock data via websocket. This project have mock data only for AMZN (Amazon) and AAPL (Apple). 

Now, in next step, create `webapp/ChartPlot2.js` file. The main piece of this javascript file to pay attention to is below JavaScript code :	

```
// call real time data ...
	 //Create stomp client over sockJS protocol
    var socket = new SockJS("api/ws");
    var stompClient = Stomp.over(socket);


 // Connect to server via websocket by using id and passwd
    stompClient.connect("guest", "guest", connectCallback, errorCallback);

	
// Callback function to be called when stomp client is connected to server
// stomp client subscribed to topic for stock price data
    var connectCallback = function() {
      stompClient.subscribe('/topic/price', renderPrice);
    }; 
 
  function renderPrice(frame) {
	// get streaming data from topic
	 var stockPrices = JSON.parse(frame.body);
  }
```
  
To run this project:
-------
* Ensure you have java 7 and maven installed
* From project root, run
```
mvn clean install
```
Then deploy war file in tomcat and 


To Test this project:
-------

* Open http://localhost:8080/streamingchart/ChartPlot2.html in your browser, you will see Amazon stock chart based on history data. You can choose the type 
of chart from drop down box. Now, before click on go live do the bellow step first.

* Open http://localhost:8080/streamingchart/api/ in different tab of your browser and add AMZN (Amazon) stock. This will start the websocket and publish stock price in topic.

*  Now in ChaartPlot2.html page , click on go live, you can see chart is moving based on the data coming from websocket.


---
tags: [messaging, websocket, stomp]
projects: [spring-framework]
---
:spring_version: current
:AtController: http://docs.spring.io/spring/docs/{spring_version}/javadoc-api/org/springframework/stereotype/Controller.html
:AtEnableWebSocket: http://docs.spring.io/spring/docs/{spring_version}/javadoc-api/org/springframework/web/socket/server/config/EnableWebSocket.html
:AtEnableWebSocketMessageBroker: http://docs.spring.io/spring/docs/{spring_version}/javadoc-api/org/springframework/messaging/simp/config/EnableWebSocketMessageBroker.html
:SpringApplication: http://docs.spring.io/spring-boot/docs/{spring_boot_version}/api/org/springframework/boot/SpringApplication.html
:Stomp_JS: http://jmesnil.net/stomp-websocket/doc/
:DispatcherServlet: http://docs.spring.io/spring/docs/{spring_version}/javadoc-api/org/springframework/web/servlet/DispatcherServlet.html
:toc:
:icons: font
:project_id: streamingchart



