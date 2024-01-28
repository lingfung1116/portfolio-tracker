package com.example.portfoliotracker.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDto {

    private LocalDateTime transactionDate;
    private String symbol;
    private String type; // BUY or SELL
    private int quantity;
    private BigDecimal price;
    private Long userId;
    private Long id;



    // Constructors
    public TransactionDto(LocalDateTime transactionDate, String symbol, String type, int quantity, BigDecimal price, Long userId, Long id) {
        this.transactionDate = transactionDate;
        this.symbol = symbol;
        this.type = type;
        this.quantity = quantity;
        this.price = price;
        this.userId = userId;
        this.id = id;
    }

    // Getters
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public String getType() {
        return type;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getSymbol() {
        return symbol;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getId() {
        return id;
    }

    // Setters
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setId(Long id) { this.id = id;}
}
