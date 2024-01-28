package com.example.portfoliotracker.dto;

import java.math.BigDecimal;

public class PositionDto {
    private String symbol;
    private int quantity;
    private BigDecimal buyInPrice;
    private BigDecimal currentPrice;
    private BigDecimal profitLoss;
    private Long userId;

    // Constructors
    public PositionDto(String symbol, int quantity, BigDecimal buyInPrice, BigDecimal currentPrice, BigDecimal profitLoss, Long userId) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.buyInPrice = buyInPrice;
        this.currentPrice = currentPrice;
        this.profitLoss = profitLoss;
        this.userId = userId;
    }
    // Getters
    public String getSymbol() {
        return symbol;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getBuyInPrice() {
        return buyInPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getProfitLoss() {
        return profitLoss;
    }

    public Long getUserId() {
        return userId;
    }


    // Setters
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setBuyInPrice(BigDecimal buyInPrice) {
        this.buyInPrice = buyInPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}