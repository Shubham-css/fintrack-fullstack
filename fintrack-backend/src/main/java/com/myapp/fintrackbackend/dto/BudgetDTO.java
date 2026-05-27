package com.myapp.fintrackbackend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BudgetDTO {
    private String category;
    private BigDecimal amount;
}