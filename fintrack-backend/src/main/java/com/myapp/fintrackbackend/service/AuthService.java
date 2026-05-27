package com.myapp.fintrackbackend.service;

import com.myapp.fintrackbackend.dto.AuthRequest;
import com.myapp.fintrackbackend.dto.AuthResponse;
import com.myapp.fintrackbackend.entity.User;
import com.myapp.fintrackbackend.repository.UserRepository;
import com.myapp.fintrackbackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName());
    }

    // Helper method to create a test user since we don't have a register page yet!
    public void registerTestUser() {
        if (userRepository.findByEmail("john@example.com").isEmpty()) {
            User testUser = new User();
            testUser.setEmail("john@example.com");
            testUser.setName("John Doe");
            testUser.setPassword(passwordEncoder.encode("password123")); // Securely hash the password
            userRepository.save(testUser);
        }
    }
}