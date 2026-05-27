package com.myapp.fintrackbackend.service;

import com.myapp.fintrackbackend.dto.BudgetDTO;
import com.myapp.fintrackbackend.entity.Budget;
import com.myapp.fintrackbackend.entity.User;
import com.myapp.fintrackbackend.repository.BudgetRepository;
import com.myapp.fintrackbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Budget> getMyBudgets() {
        return budgetRepository.findByUserId(getCurrentUser().getId());
    }

    public Budget saveOrUpdateBudget(BudgetDTO dto) {
        User user = getCurrentUser();

        Optional<Budget> existingBudget = budgetRepository.findByUserIdAndCategory(user.getId(), dto.getCategory());

        Budget budget;
        if (existingBudget.isPresent()) {
            budget = existingBudget.get();
            budget.setAmount(dto.getAmount());
        } else {
            budget = new Budget();
            budget.setUser(user);
            budget.setCategory(dto.getCategory());
            budget.setAmount(dto.getAmount());
        }

        return budgetRepository.save(budget);
    }

    // DELETE a budget
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        // Security Check
        User user = getCurrentUser();
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this budget");
        }

        budgetRepository.delete(budget);
    }
}