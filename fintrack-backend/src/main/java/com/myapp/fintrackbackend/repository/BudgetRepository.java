package com.myapp.fintrackbackend.repository;

import com.myapp.fintrackbackend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Gets all budgets for the user
    List<Budget> findByUserId(Long userId);

    // Checks if a specific category already exists when setting a budget
    Optional<Budget> findByUserIdAndCategory(Long userId, String category);

    // Searches budgets by category for the global search bar
    List<Budget> findByUserIdAndCategoryContainingIgnoreCase(Long userId, String category);
}