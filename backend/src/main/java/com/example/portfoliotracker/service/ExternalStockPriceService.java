package com.example.portfoliotracker.service;

import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExternalStockPriceService {

    @Value("${marketstack.apikey}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final String baseUrl = "http://api.marketstack.com/v1/";

    public ExternalStockPriceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

//    public Map<String, Object> getStockQuote(String symbol) {
//        String url = baseUrl + "eod?access_key=" + apiKey + "&symbols=" + symbol;
//        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
//        return response;
//    }

    public Map<String, Object> getStockQuote(String symbol) {
        // Hardcoded response for testing purposes
        Map<String, Object> response = new HashMap<>();

        // Setting up the pagination part
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("limit", 100);
        pagination.put("offset", 0);
        pagination.put("count", 100);
        pagination.put("total", 9944);
        response.put("pagination", pagination);

        // Setting up the data part
        List<Map<String, Object>> dataList = new ArrayList<>();
        Map<String, Object> dataEntry = new HashMap<>();
        dataEntry.put("open", 129.8);
        dataEntry.put("high", 133.04);
        dataEntry.put("low", 129.47);
        dataEntry.put("close", 132.995);
        dataEntry.put("volume", 106686703.0);
        dataEntry.put("adj_high", 133.04);
        dataEntry.put("adj_low", 129.47);
        dataEntry.put("adj_close", 132.995);
        dataEntry.put("adj_open", 129.8);
        dataEntry.put("adj_volume", 106686703.0);
        dataEntry.put("split_factor", 1.0);
        dataEntry.put("dividend", 0.0);
        dataEntry.put("symbol", "AAPL");
        dataEntry.put("exchange", "XNAS");
        dataEntry.put("date", "2021-04-09T00:00:00+0000");
        dataList.add(dataEntry);


        response.put("data", dataList);

        return response;
    }
}

