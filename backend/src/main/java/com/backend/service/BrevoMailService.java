package com.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Profile("prod")
public class BrevoMailService implements EmailService {

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${spring.mail.username}")
    private String senderEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendResetPasswordEmail(String to, String resetLink) {
        sendEmail(to, "Reset Your Password - Digital Capsule",
                "Hello,\n\nClick the link below to reset your password:\n" + resetLink
                        + "\n\nThis link will expire in 15 minutes.\n\n- Digital Capsule Team");
    }

    @Override
    public void sendOtpEmail(String to, String otp) {
        sendEmail(to, "Verify Your Account - Digital Capsule",
                "Hello,\n\nYour verification OTP is: " + otp + "\n\nIt will expire in 10 minutes.");
    }

    private void sendEmail(String to, String subject, String textContent) {
        String API_URL = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> body = Map.of(
                "sender", Map.of("email", senderEmail, "name", "Digital Capsule"),
                "to", List.of(Map.of("email", to)),
                "subject", subject,
                "textContent", textContent
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new Exception("Can not send email, status: "+ response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("🚨 Error sending email via Brevo: " + e.getMessage());
        }
    }

}
