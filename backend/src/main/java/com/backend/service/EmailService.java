package com.backend.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendResetPasswordEmail(String to, String resetLink);
    void sendOtpEmail(String to, String otp);
}
