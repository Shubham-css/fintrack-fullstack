package com.myapp.fintrackbackend.repository;

import com.myapp.fintrackbackend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Gets all transactions for the dashboard and table
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    //  Searches transactions by title for the global search bar
    List<Transaction> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
}