package com.myapp.fintrackbackend.controller;

import com.myapp.fintrackbackend.dto.BudgetDTO;
import com.myapp.fintrackbackend.entity.Budget;
import com.myapp.fintrackbackend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets() {
        return ResponseEntity.ok(budgetService.getMyBudgets());
    }

    @PostMapping
    public ResponseEntity<Budget> setBudget(@RequestBody BudgetDTO dto) {
        return ResponseEntity.ok(budgetService.saveOrUpdateBudget(dto));
    }

    // 👇 NEW: DELETE Endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}