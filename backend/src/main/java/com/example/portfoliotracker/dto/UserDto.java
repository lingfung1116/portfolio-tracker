package com.example.portfoliotracker.dto;

public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String token; // Added token field
    // Constructors

    // Constructor without token for general use

    public UserDto(Long id, String username, String token) {
        this.id = id;
        this.username = username;
        this.token = token;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() { return id; }

    public String getUsername() {
        return username;
    }


    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
