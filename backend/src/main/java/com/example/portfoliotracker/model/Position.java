package com.example.portfoliotracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "positions")
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal buyIn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private boolean isOpen = true;

    // Constructors
    public Position() {
    }

    public Position(String symbol, int quantity, BigDecimal buyIn, User user) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.buyIn = buyIn;
        this.user = user;
        this.isOpen = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getBuyIn() {
        return buyIn;
    }

    public void setBuyIn(BigDecimal buyIn) {
        this.buyIn = buyIn;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public void setOpen(boolean open) {
        isOpen = open;
    }

    // Method to update average buy-in price
    public void updateAverageBuyInPrice(BigDecimal purchasePrice, int purchaseQuantity) {
        BigDecimal totalQuantity = BigDecimal.valueOf(this.quantity + purchaseQuantity);
        BigDecimal totalCost = this.buyIn.multiply(BigDecimal.valueOf(this.quantity))
                .add(purchasePrice.multiply(BigDecimal.valueOf(purchaseQuantity)));

        this.buyIn = totalCost.divide(totalQuantity, RoundingMode.HALF_UP);
        this.quantity += purchaseQuantity;
    }
}
