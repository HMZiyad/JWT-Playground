package com.playground.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Username -> OTP
    // In a real app, use Redis or DB with expiry
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    private static final long OTP_VALID_DURATION = 1000 * 60 * 3; // 3 minutes

    public String generateOtp(String username) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(username, otp);
        otpExpiry.put(username, System.currentTimeMillis() + OTP_VALID_DURATION);
        return otp;
    }

    public boolean validateOtp(String username, String otp) {
        if (!otpStorage.containsKey(username)) {
            return false;
        }

        Long expiryTime = otpExpiry.get(username);
        if (System.currentTimeMillis() > expiryTime) {
            otpStorage.remove(username);
            otpExpiry.remove(username);
            return false;
        }

        String storedOtp = otpStorage.get(username);
        // OTP matches
        boolean isValid = storedOtp.equals(otp);
        if (isValid) {
            // Consume OTP so it cannot be reused
            otpStorage.remove(username);
            otpExpiry.remove(username);
        }
        return isValid;
    }
}
