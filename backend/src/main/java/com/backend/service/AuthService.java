package com.backend.service;

import com.backend.model.Tokens;
import com.backend.model.Users;
import com.backend.model.enums.TokenType;
import com.backend.repositories.TokenRepository;
import com.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${frontend.base.url}")
    private String frontendBaseUrl;

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    public AuthService(UserRepository userRepository, TokenRepository tokenRepository){
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    public Users registerUser(Users user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDate.now());
        user.setVerified(false);
        return userRepository.save(user);
    }

    public Users authenticateUser(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }
        return userOpt.get();
    }

    public void handleForgotPassword(String email) {

        Optional<Users> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()){
            throw new RuntimeException("User does not exists with email: " + email);
        }

        Users user = userOpt.get();

        // remove old tokens for this user
        tokenRepository.deleteByUserIdAndType(user.getId(), TokenType.RESET_PASSWORD);

        Tokens token = new Tokens();
        token.setUserId(user.getId());
        token.setToken(UUID.randomUUID().toString());
        token.setType(TokenType.RESET_PASSWORD);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        token.setConsumed(false);
        tokenRepository.save(token);

        String resetLink = frontendBaseUrl + "/auth/reset-password?token=" + token.getToken();

        mailService.sendResetPasswordEmail(email, resetLink);
    }

    public Tokens handleValidateToken(String tokenValue) {

        Optional<Tokens> tokenOpt = tokenRepository.findByTokenAndType(tokenValue, TokenType.RESET_PASSWORD);

        return tokenOpt
                .filter(t -> !t.isConsumed())
                .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token."));

    }

    public void handleResetPassword(String tokenValue, String password) {

        Tokens token = handleValidateToken(tokenValue);
        Optional<Users> userOpt = userRepository.findById(token.getUserId());

        Users user = userOpt.orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        token.setConsumed(true);
        tokenRepository.save(token);
    }

    public void handleOtpSend(String email) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if(userOpt.isEmpty()){
            throw new RuntimeException("User does not exists with email: " + email);
        }
        Users user = userOpt.get();
        if(user.isVerified()){
            throw new RuntimeException("User already verified with email: " + email);
        }

        tokenRepository.deleteByUserIdAndType(user.getId(), TokenType.VERIFY_EMAIL);

        // generate new 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        Tokens token = new Tokens();
        token.setUserId(user.getId());
        token.setToken(otp);
        token.setType(TokenType.VERIFY_EMAIL);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        token.setConsumed(false);
        tokenRepository.save(token);

        // send email
        mailService.sendOtpEmail(user.getEmail(), otp);


    }

    public void handleOtpVerification(String email, String otp) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Tokens token = tokenRepository.findByTokenAndType(otp, TokenType.VERIFY_EMAIL)
                .filter(t -> !t.isConsumed())
                .filter(t -> t.getUserId().equals(user.getId()))
                .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired OTP."));

        user.setVerified(true);
        userRepository.save(user);

        token.setConsumed(true);
        tokenRepository.save(token);
    }
}
