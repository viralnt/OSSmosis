package com.oss.streamingchart;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;





@JsonIgnoreProperties(ignoreUnknown=true)
public class HisShareData {
	
	private StockData[] quote ;

	public StockData[] getQuote() {
		return quote;
	}

	public void setQuote(StockData[] quote) {
		this.quote = quote;
	}
	
	

}
