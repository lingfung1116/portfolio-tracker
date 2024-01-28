package com.example.portfoliotracker.repository;

import com.example.portfoliotracker.model.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    // Find all positions for a given user
    List<Position> findByUserId(Long userId);

    // Find positions by symbol for a user
    Optional<Position> findByUserIdAndSymbol(Long userId, String symbol);
}