package com.oss.streamingchart;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;



/**
 * This class will be used to convert json to object conversion 
 * @author suprakash_bhowmik
 *
 */

@JsonIgnoreProperties(ignoreUnknown=true)
public class StockData  {
	
	@JsonProperty("Symbol")
	private String symbol;
	@JsonProperty("Date")
	private String date;
	@JsonProperty("Open")
	private String open;
	@JsonProperty("High")
	private String high;
	@JsonProperty("Low")
	private String low;
	@JsonProperty("Close")
	private String close;
	@JsonProperty("Volume")
	private String volume;
	@JsonProperty("Adj_Close")
	private String adjClose;
	
	
	public String getSymbol() {
		return symbol;
	}
	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getOpen() {
		return open;
	}
	public void setOpen(String open) {
		this.open = open;
	}
	public String getHigh() {
		return high;
	}
	public void setHigh(String high) {
		this.high = high;
	}
	public String getLow() {
		return low;
	}
	public void setLow(String low) {
		this.low = low;
	}
	public String getClose() {
		return close;
	}
	public void setClose(String close) {
		this.close = close;
	}
	public String getVolume() {
		return volume;
	}
	public void setVolume(String volume) {
		this.volume = volume;
	}
	public String getAdjClose() {
		return adjClose;
	}
	public void setAdjClose(String adjClose) {
		this.adjClose = adjClose;
	}
	
	
	/*@Override
	public int compareTo(StockData compareStock) {
		DateFormat format = new SimpleDateFormat("yyyy-mm-dd", Locale.ENGLISH);
		//Date date = format.parse(string);
		
		String compareDateString = compareStock.getDate();
		Date compareDate=null;
		Date currObjDate=null;
		try {
			compareDate = format.parse(compareDateString);
			currObjDate = format.parse(this.date);
		} catch (Exception e) {
			System.out.println(" Exception "+e);
		}
		
		System.out.println(" Compare to 1-----"+compareDate.compareTo(currObjDate));
		System.out.println(" Compare to 2-----"+currObjDate.compareTo(compareDate));
		return currObjDate.compareTo(compareDate);
	}	*/
	
	
}
