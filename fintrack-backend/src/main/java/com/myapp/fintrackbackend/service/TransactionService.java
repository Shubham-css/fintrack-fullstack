package com.myapp.fintrackbackend.service;

import com.myapp.fintrackbackend.dto.TransactionDTO;
import com.myapp.fintrackbackend.entity.Transaction;
import com.myapp.fintrackbackend.entity.User;
import com.myapp.fintrackbackend.repository.TransactionRepository;
import com.myapp.fintrackbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper method to get the currently logged-in user from the JWT token
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // CREATE a new transaction
    public Transaction addTransaction(TransactionDTO dto) {
        User user = getCurrentUser();

        Transaction transaction = new Transaction();
        transaction.setTitle(dto.getTitle());
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());
        transaction.setUser(user); // Link the transaction to the specific user!

        return transactionRepository.save(transaction);
    }

    // READ all transactions for the logged-in user
    public List<Transaction> getMyTransactions() {
        User user = getCurrentUser();
        // This uses the custom method we wrote in TransactionRepository earlier!
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    // UPDATE an existing transaction
    public Transaction updateTransaction(Long id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Security Check: Make sure the logged-in user actually owns this transaction!
        User user = getCurrentUser();
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to edit this transaction");
        }

        transaction.setTitle(dto.getTitle());
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());

        return transactionRepository.save(transaction);
    }

    // DELETE a transaction
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Security Check
        User user = getCurrentUser();
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }
}