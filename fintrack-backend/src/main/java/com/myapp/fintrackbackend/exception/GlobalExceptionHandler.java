package com.myapp.fintrackbackend.exception;

import com.myapp.fintrackbackend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handles Bad Credentials (Wrong Password or User Not Found)
    @ExceptionHandler({RuntimeException.class, UsernameNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleAuthenticationException(Exception ex) {

        // If the error message is specifically about passwords or missing users, return a 401 Unauthorized
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage()
        );

        return new ResponseEntity<>(errorResponse, status);
    }

    // Handles all other unexpected system crashes
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                "An unexpected error occurred. Please try again later."
        );

        return new ResponseEntity<>(errorResponse, status);
    }
}