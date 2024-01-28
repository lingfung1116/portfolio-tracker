package com.example.portfoliotracker.controller;

import com.example.portfoliotracker.dto.PositionDto;
import com.example.portfoliotracker.service.PositionService;
import com.example.portfoliotracker.service.ExternalStockPriceService;
import com.example.portfoliotracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    private final PositionService positionService;
    private final ExternalStockPriceService externalStockPriceService;
    private final UserService userService;

    @Autowired
    public PositionController(PositionService positionService, ExternalStockPriceService externalStockPriceService, UserService userService) {
        this.positionService = positionService;
        this.externalStockPriceService = externalStockPriceService;
        this.userService = userService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PositionDto>> getAllPositionsByUserId(@PathVariable Long userId) {
        List<PositionDto> positions = positionService.findPositionsByUserId(userId)
                .stream()
                .map(position -> {
                    BigDecimal currentPrice = positionService.getCurrentMarketPrice(position.getSymbol());
                    BigDecimal profitLoss = positionService.calculateProfitLoss(position);
                    return new PositionDto(
                            position.getSymbol(),
                            position.getQuantity(),
                            position.getBuyIn(),
                            currentPrice,
                            profitLoss,
                            userId
                    );
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(positions);
    }
}
