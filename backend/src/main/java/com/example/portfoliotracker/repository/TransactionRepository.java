package com.example.portfoliotracker.repository;

import com.example.portfoliotracker.model.Position;
import com.example.portfoliotracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Find all transactions for a given position
    List<Transaction> findByUserId(Long userId);
}
