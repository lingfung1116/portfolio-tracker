package com.example.portfoliotracker.service;

import com.example.portfoliotracker.dto.TransactionDto;
import com.example.portfoliotracker.model.Transaction;
import com.example.portfoliotracker.model.User;
import com.example.portfoliotracker.repository.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final PositionService positionService;
    private final UserService userService; // Added a reference to UserService

    @Autowired
    public TransactionService(TransactionRepository transactionRepository,
                              PositionService positionService,
                              UserService userService) { // Modified constructor to include UserService
        this.transactionRepository = transactionRepository;
        this.positionService = positionService;
        this.userService = userService; // Assign UserService
    }

    public Transaction createTransaction(TransactionDto transactionDto, Long userId) {
        // Fetch the user using UserService
        User user = userService.getUserByIdOrThrow(userId);

        // Create and set up a new Transaction object using the provided DTO and the retrieved user
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(transactionDto.getTransactionDate());
        transaction.setType(transactionDto.getType());
        transaction.setQuantity(transactionDto.getQuantity());
        transaction.setPrice(transactionDto.getPrice());
        transaction.setUser(user); // Set the user object directly
        transaction.setSymbol(transactionDto.getSymbol());

        // Save the transaction
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update or create a position based on the transaction
        positionService.addOrUpdatePosition(savedTransaction);

        // Return the saved transaction
        return savedTransaction;
    }

    // Method to find transactions by user ID
    public List<Transaction> findTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    // Method to delete a transaction
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }
}


