package com.example.portfoliotracker.controller;

import com.example.portfoliotracker.dto.TransactionDto;
import com.example.portfoliotracker.exception.ErrorResponse;
import com.example.portfoliotracker.model.Transaction;
import com.example.portfoliotracker.model.User;
import com.example.portfoliotracker.service.TransactionService;
import com.example.portfoliotracker.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    @Autowired
    public TransactionController(TransactionService transactionService, UserService userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }

    // Retrieve transactions by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTransactionsByUserId(@PathVariable Long userId) {
        return userService.findUserById(userId)
                .<ResponseEntity<?>>map(user -> {
                    List<Transaction> transactions = transactionService.findTransactionsByUserId(userId);
                    List<TransactionDto> transactionDtos = transactions.stream()
                            .map(this::convertToDto)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(transactionDtos);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).<ErrorResponse>body(new ErrorResponse(
                        "NOT_FOUND", // Status
                        "User not found", // Message
                        Collections.singletonList("User with ID " + userId + " does not exist.") // List of errors
                )));
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionDto transactionDto) {
        try {
            Long userId = transactionDto.getUserId();
            User user = userService.getUserByIdOrThrow(userId);
            Transaction transaction = transactionService.createTransaction(transactionDto, userId);
            TransactionDto newTransactionDto = convertToDto(transaction);
            return ResponseEntity.ok(newTransactionDto);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(
                    "NOT_FOUND", // Status
                    "Transaction creation failed", // Message
                    Collections.singletonList(ex.getMessage()) // List of errors
            ));
        }
    }

    // Helper method to convert Transaction entity to TransactionDto
    private TransactionDto convertToDto(Transaction transaction) {
        return new TransactionDto(
                transaction.getTransactionDate(),
                transaction.getSymbol(),
                transaction.getType(),
                transaction.getQuantity(),
                transaction.getPrice(),
                transaction.getUser().getId(),
                transaction.getId()
        );
    }

    // Delete a transaction by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(
                    "NOT_FOUND", // Status
                    "Transaction not found", // Message
                    Collections.singletonList("Transaction with ID " + id + " does not exist.") // List of errors
            ));
        }
    }
}