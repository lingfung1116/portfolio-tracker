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
        return positionRepository.findByUserId(userId);
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

        // Adjust the quantity and buy-in based on the transaction type
        if ("BUY".equalsIgnoreCase(transaction.getType())) {
            updateAverageBuyInPrice(position, transaction.getPrice(), transaction.getQuantity());
        } else if ("SELL".equalsIgnoreCase(transaction.getType())) {
            sellSharesAndUpdatePosition(position, transaction.getQuantity());
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
        BigDecimal profitLoss = currentTotalValue.subtract(initialTotalValue);
        return profitLoss.divide(initialTotalValue, RoundingMode.HALF_UP);
    }
}