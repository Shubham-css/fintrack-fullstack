package com.myapp.fintrackbackend.controller;

import com.myapp.fintrackbackend.dto.TransactionDTO;
import com.myapp.fintrackbackend.entity.Transaction;
import com.myapp.fintrackbackend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // POST: http://localhost:8080/api/v1/transactions
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(transactionService.addTransaction(dto));
    }

    // GET: http://localhost:8080/api/v1/transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions() {
        return ResponseEntity.ok(transactionService.getMyTransactions());
    }
    // PUT: http://localhost:8080/api/v1/transactions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, dto));
    }

    // DELETE: http://localhost:8080/api/v1/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}