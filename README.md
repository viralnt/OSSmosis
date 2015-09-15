# streamingchart

A project demonstrating capabilities that sends streaming stock information from server to browser by Spring Websocket and D3 javascript library uses this information to create different types of moving chart (candle stick,Bar and OHOC).

### Client-side libraries used:

* stomp js : This Spring web project uses STOMP over WebSocket messaging between server and browser.
* sockjs : This application also uses SockJS so that Websocket work for all modern browsers which supports this protocol and in environments which don't support the WebSocket protocol -- for example, behind restrictive corporate proxies.
* d3 js : To create Chart

### Server-side 

Server side component builds by Spring Framework 4.0 and runs on Tomcat 7.0.47+ and . Other servlet 3.0 containers should also function correctly.



### Using a Message Broker:

Out of the box, a "simple" message broker Spring in memory is used to send messages (stock information) to subscribers(browser).But in production its recommended to use fully featured STOMP message broker such as RabbitMQ, ActiveMQ.

For RabbitMQ, you have to install STOMP plugin as well along with RabitMQ. For ActiveMQ you need to configure a STOMP transport connnector.
The default settings should work for RabbitMQ and ActiveMQ




To run this project:
-------
* Ensure you have java 7 and maven installed
* From project root, run
```
mvn clean install
```
Then deploy war file in tomcat and 

* Open http://localhost:8080/streamingchart/api/ in your browser

tags	projects
D3
Charts
websocket
stomp
sock
spring-framework



