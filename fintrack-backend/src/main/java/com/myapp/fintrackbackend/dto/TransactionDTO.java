package com.myapp.fintrackbackend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDTO {
    private String title;
    private BigDecimal amount;
    private String type;     // "INCOME" or "EXPENSE"
    private String category; // e.g., "Food", "Salary", "Bills"
    private LocalDate date;
}