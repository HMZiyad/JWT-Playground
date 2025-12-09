package com.playground.backend.controller;

import com.playground.backend.security.JwtUtil;
import com.playground.backend.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gatekeeper")
public class AuthController {

    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    public AuthController(OtpService otpService, JwtUtil jwtUtil) {
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body("Username is required!");
        }

        String otp = otpService.generateOtp(username);
        // In a real scenario, send SMS/Email. Here we print to console and return it
        // for demo purposes if needed,
        // but the prompt says "Display: A fun message... sent to imaginary phone".
        // HOWEVER, for the user to login, they NEED the OTP.
        // I will log it visibly on the backend console.

        System.out.println("\n\n=================================================");
        System.out.println("GATEKEEPER ALERT: Magic Word for " + username + " is: " + otp);
        System.out.println("=================================================\n\n");
        // Also print to stderr to ensure visibility in some terminals
        System.err.println("GATEKEEPER ALERT: Magic Word is " + otp);

        return ResponseEntity.ok(Map.of("message",
                "A special magic word was sent to your imaginary parent's phone! Hurry, it only lasts a minute!"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");

        if (otpService.validateOtp(username, otp)) {
            String jwt = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of(
                    "message", "Success! You got your Secret Sticker!",
                    "token", jwt));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Wrong Magic Word! The Gatekeeper stays closed."));
        }
    }
}
