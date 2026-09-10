package com.applypilot.auth.controller;

import com.applypilot.auth.dto.AuthResponse;
import com.applypilot.auth.dto.LoginRequest;
import com.applypilot.auth.dto.RegisterRequest;
import com.applypilot.auth.dto.UserDto;
import com.applypilot.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal String userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }
            UserDto userDto = authService.getUserProfile(UUID.fromString(userId));
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
