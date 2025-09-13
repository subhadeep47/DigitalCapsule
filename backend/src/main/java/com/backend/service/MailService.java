package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("digital.capsule.official@gmail.com");
        message.setTo(to);
        message.setSubject("Reset Your Password - Digital Capsule");
        message.setText("Hello,\n\nClick the link below to reset your password:\n" + resetLink
                + "\n\nThis link will expire in 15 minutes.\n\n- Digital Capsule Team");

        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("digital.capsule.official@gmail.com");
        message.setTo(to);
        message.setSubject("Verify Your Account - Digital Capsule");
        message.setText("Hello,\n\nYour verification OTP is: " + otp + "\n\nIt will expire in 10 minutes.");

        mailSender.send(message);
    }

}
