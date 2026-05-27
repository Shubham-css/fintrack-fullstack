package com.myapp.fintrackbackend.controller;

import com.myapp.fintrackbackend.entity.Budget;
import com.myapp.fintrackbackend.entity.Transaction;
import com.myapp.fintrackbackend.entity.User;
import com.myapp.fintrackbackend.repository.BudgetRepository;
import com.myapp.fintrackbackend.repository.TransactionRepository;
import com.myapp.fintrackbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> globalSearch(@RequestParam String query) {
        User user = getCurrentUser();

        // Find matching transactions and budgets
        List<Transaction> transactions = transactionRepository.findByUserIdAndTitleContainingIgnoreCase(user.getId(), query);
        List<Budget> budgets = budgetRepository.findByUserIdAndCategoryContainingIgnoreCase(user.getId(), query);

        // Package them together in a Map
        Map<String, Object> results = new HashMap<>();
        results.put("transactions", transactions);
        results.put("budgets", budgets);

        return ResponseEntity.ok(results);
    }
}