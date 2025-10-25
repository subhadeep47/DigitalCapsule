package com.backend.controller;

import com.backend.model.Users;
import com.backend.service.AuthService;
import com.backend.service.MailService;
import com.backend.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private MailService mailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        try {
            Users registeredUser = authService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user, HttpServletResponse response) {
        try {
            Users authenticatedUser = authService.authenticateUser(user.getEmail(), user.getPassword());
            String token = jwtUtil.generateToken(authenticatedUser.getEmail());
            jwtUtil.setJwtCookie(response, token);
            return ResponseEntity.ok().body("logged in successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0) // Expire immediately
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request){
        try {
            authService.handleForgotPassword(request.get("email"));
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Reset password failed: " + e.getMessage());
        }
    }

    @GetMapping("/validate-token")
    public  ResponseEntity<?> validateToken(@RequestParam String token){
        try {
            authService.handleValidateToken(token);
            return ResponseEntity.ok("Validated token successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("validate token failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public  ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request, @RequestParam String token){
        try {
            authService.handleResetPassword(token, request.get("password"));
            return ResponseEntity.ok("Reset password successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("validate token failed: " + e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request){
        try {
            authService.handleOtpSend(request.get("email"));
            return ResponseEntity.ok("OTP sent to email successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("OTP send failed: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public  ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request){
        try {
            authService.handleOtpVerification(request.get("email"), request.get("otp"));
            return ResponseEntity.ok("OTP verification successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("validate token failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-email")
    public ResponseEntity<?> changeEmail(@RequestBody Map<String, String> request, HttpServletResponse response){
        try{
            authService.handleEmailChange(request.get("oldEmail"), request.get("newEmail"), request.get("password"));
            authService.handleNewTokenGeneration(request.get("newEmail"), response);
            return ResponseEntity.ok("Email changed successfully");
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Email address change failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, HttpServletRequest req){
        try{
            String email = jwtUtil.extractEmail(jwtUtil.extractJwtFromCookies(req));
            authService.handlePasswordChange(request.get("currentPassword"), request.get("newPassword"), email);
            return ResponseEntity.ok("Password changed successfully");
        } catch(Exception e){
            return ResponseEntity.badRequest().body("Password change failed: " + e.getMessage());
        }
    }

}
