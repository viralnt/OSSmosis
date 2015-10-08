package com.oss.streamingchart;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class WebSocketController {

  @Autowired 
  private SimpMessagingTemplate template;  
  private TaskScheduler scheduler = new ConcurrentTaskScheduler();
  private List<StockData> stockListPrices = new ArrayList<StockData>();
  
  
  private static Map<String, HisShareData> stockData = new HashMap<String, HisShareData>();
  private static int index = 0;
  
  @Autowired 
  private HttpServletRequest request;
  
  /**
   * Iterates stock list, update the price by randomly choosing a positive
   * or negative percentage, then broadcast it to all subscribing clients
   */
  private void updatePriceAndBroadcast() {
	 
	 
    for(StockData stock : stockListPrices) {
    	String code = stock.getSymbol();
    	HisShareData data = null;
  	  if(null != stockData && null!= stockData.get(code.toUpperCase())){
  		  System.out.println(" found in map----->");
  			 data = stockData.get(code.toUpperCase());
  		}else {
  			String fileName =code.toUpperCase()+"_Data.json";
  			data = getMockData(fileName);
  			stockData.put(code.toUpperCase(), data);
  		}
  	  	System.out.println(" data --->"+data);
  		StockData[] stockData=data.getQuote();
    	
  		//Populate stock for publish
  		stock.setSymbol(stockData[index].getSymbol());
  		stock.setHigh(stockData[index].getHigh());
  		stock.setClose(stockData[index].getClose());
  		stock.setLow(stockData[index].getLow());
  		stock.setDate(stockData[index].getDate());
  		stock.setOpen(stockData[index].getOpen());
  		stock.setVolume(stockData[index].getVolume());
  		stock.setAdjClose(stockData[index].getAdjClose());
  		index++;
  		 
  		// In mock we have data for only 60 days, so reset the index back to
  		// 5 so that websocket can cont. stream the stock price
  		if(index == 40){
  			index = 5;
  		}
  		
  		// put the stock price in topic , this topic will be listen by browser sock client
  		template.convertAndSend("/topic/price", stockListPrices);
    }
     
    
    
  }
  
  /**
   * Invoked after bean creation is complete, this method will schedule 
   * updatePriceAndBroacast to run in every 1 second
   */
  @PostConstruct
  private void broadcastTimePeriodically() {
	 
	// schedule to run every 1 second  
    scheduler.scheduleAtFixedRate(new Runnable() {
      @Override public void run() {
        updatePriceAndBroadcast();
      }
    }, 1000);
  }
  
  /**
   * Handler to add one stock
   * This project have mock data for only Amazon (AMZN) and Apple (AAPL)
   */
  @MessageMapping("/addStock")
  public void addStock(StockData stock) throws Exception {
	  
	 // Servlet
	  System.out.println(" in add stock :==== "+request);
	  if(stock ==null){
		  stock = new StockData();
	  }
	 // Add stock in list , if already not exist
	 String code = stock.getSymbol();
	 int count = 0;
	 for(StockData stockData : stockListPrices){
		 String stockDcode = stockData.getSymbol();
		 if(code.equalsIgnoreCase(stockDcode)){
			 count++;
		 }
	 }
	 if(count == 0){
		 stockListPrices.add(stock);
	 }
    updatePriceAndBroadcast();
  }
  
 
  /**
   * Display page to add Stock 
   * This project have mock data for only Amazon (AMZN) and Apple (AAPL)
   */
  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String home() {
    return "home";
  }
  
  /**
   * get the mock data from stubbed json file
   * @param fileName
   * @return
   */
  private HisShareData getMockData(String fileName){
		
		ObjectMapper objectMapper = new ObjectMapper();
		HisShareData data = null;
		try {			
			Resource resource = new ClassPathResource(fileName);
			InputStream stream = resource.getInputStream();
			System.out.println("stream from Mock File --->"+stream);
			data = objectMapper.readValue(stream, HisShareData.class);
			System.out.println("before reverse-------");
			StockData[] quotes = data.getQuote();
			Collections.reverse(Arrays.asList(quotes));
			
			//Arrays.sort(quote);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fileName = "AMZN".toUpperCase()+"_Data.json";
			Resource resource = new ClassPathResource(fileName);			
			try {
				InputStream stream = resource.getInputStream();
				data = objectMapper.readValue(stream, HisShareData.class);
				
				//StockData[] quote = data.getQuote();
				//System.out.println("before sort-------");
				//Arrays.sort(quote);
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} 
		}
		
		return data;
	}
  
  

}
