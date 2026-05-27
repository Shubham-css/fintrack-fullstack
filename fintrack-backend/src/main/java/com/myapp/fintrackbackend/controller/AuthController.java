package com.myapp.fintrackbackend.controller;

import com.myapp.fintrackbackend.dto.AuthRequest;
import com.myapp.fintrackbackend.dto.AuthResponse;
import com.myapp.fintrackbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Change this from @PostMapping to @GetMapping
    @GetMapping("/setup")
    public ResponseEntity<String> setupTestUser() {
        authService.registerTestUser();
        return ResponseEntity.ok("Test user created! You can now log in with john@example.com / password123");
    }
}