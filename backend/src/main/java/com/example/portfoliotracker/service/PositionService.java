package com.example.portfoliotracker.service;

import com.example.portfoliotracker.model.Position;
import com.example.portfoliotracker.model.Transaction;
import com.example.portfoliotracker.repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PositionService {

    private final PositionRepository positionRepository;

    @Autowired
    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    @Autowired
    private ExternalStockPriceService externalStockPriceService;

    public List<Position> findPositionsByUserId(Long userId) {
        // Use a stream to filter only the positions that are open
        return positionRepository.findByUserId(userId).stream()
                .filter(Position::isOpen) // This uses the isOpen method of Position to filter
                .collect(Collectors.toList());
    }

    public Position savePosition(Position position) {
        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        positionRepository.deleteById(id);
    }

    @Transactional
    public Position addOrUpdatePosition(Transaction transaction) {
        Optional<Position> existingPosition = positionRepository
                .findByUserIdAndSymbol(transaction.getUser().getId(), transaction.getSymbol());

        Position position = existingPosition.orElseGet(() -> new Position(
                transaction.getSymbol(),
                0,
                BigDecimal.ZERO,
                transaction.getUser()
        ));

        if ("BUY".equalsIgnoreCase(transaction.getType())) {
            updateAverageBuyInPrice(position, transaction.getPrice(), transaction.getQuantity());
            position.setOpen(true); // Ensure the position is marked as open when buying
        } else if ("SELL".equalsIgnoreCase(transaction.getType())) {
            sellSharesAndUpdatePosition(position, transaction.getQuantity());
            // If after selling the quantity is zero, then position will be closed in sellSharesAndUpdatePosition method.
        }

        return positionRepository.save(position);
    }

    private void sellSharesAndUpdatePosition(Position position, int quantityToSell) {
        if (quantityToSell > position.getQuantity()) {
            throw new IllegalStateException("Not enough shares to sell");
        }

        int remainingQuantity = position.getQuantity() - quantityToSell;
        position.setQuantity(remainingQuantity);

        if (remainingQuantity == 0) {
            position.setOpen(false); // Close the position if all shares are sold
        }
        // No need to update the buy-in price since it reflects the original purchase price
    }

    private void updateAverageBuyInPrice(Position position, BigDecimal newPrice, int newQuantity) {
        BigDecimal totalQuantity = BigDecimal.valueOf(position.getQuantity()).add(BigDecimal.valueOf(newQuantity));
        BigDecimal totalCost = position.getBuyIn().multiply(BigDecimal.valueOf(position.getQuantity()))
                .add(newPrice.multiply(BigDecimal.valueOf(newQuantity)));

        position.setQuantity(totalQuantity.intValue());
        position.setBuyIn(totalCost.divide(totalQuantity, RoundingMode.HALF_EVEN));
        position.setOpen(true); // Mark the position as open when the average buy-in price is updated
    }

    @Transactional
    public Position closePosition(Long positionId) {
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new EntityNotFoundException("Position not found"));
        position.setOpen(false);
        return positionRepository.save(position);
    }

    public BigDecimal getCurrentMarketPrice(String symbol) {
        Map<String, Object> response = externalStockPriceService.getStockQuote(symbol);
        if (response != null && response.containsKey("data")) {
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
            if (!data.isEmpty()) {
                Map<String, Object> latestData = data.get(0);
                return new BigDecimal(latestData.get("close").toString());
            }
        }
        throw new EntityNotFoundException("Price information not available for: " + symbol);
    }

    public BigDecimal calculateProfitLoss(Position position) {
        BigDecimal currentPrice = getCurrentMarketPrice(position.getSymbol());
        BigDecimal currentTotalValue = currentPrice.multiply(BigDecimal.valueOf(position.getQuantity()));
        BigDecimal initialTotalValue = position.getBuyIn().multiply(BigDecimal.valueOf(position.getQuantity()));

        // Check if initialTotalValue is zero to prevent division by zero
        if (initialTotalValue.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO; // If no initial value, profit/loss is zero
        }

        BigDecimal profitLoss = currentTotalValue.subtract(initialTotalValue);
        return profitLoss.divide(initialTotalValue, RoundingMode.HALF_UP);
    }
}