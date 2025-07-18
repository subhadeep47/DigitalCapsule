package com.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.model.SearchUser;
import com.backend.model.Users;
import com.backend.service.UserService;
import com.backend.utils.JwtUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class UserController {
	
	@Autowired
    private UserService usersService;

    @Autowired
    private JwtUtils jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users user) {
        try {
            Users registeredUser = usersService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user, HttpServletResponse response) {
        try {
            Users authenticatedUser = usersService.authenticateUser(user.getEmail(), user.getPassword());
            String token = jwtUtil.generateToken(authenticatedUser.getEmail());
            jwtUtil.setJwtCookie(response, token);
            return ResponseEntity.ok().body("logged in successfully");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            SearchUser searchUser = usersService.getCurrentUser(email);
            return ResponseEntity.ok(searchUser);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query, HttpServletRequest request) {
        try {
        	String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            List<SearchUser> searchUsers = usersService.searchUsers(query, email);
            return ResponseEntity.ok(searchUsers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Search failed: " + e.getMessage());
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

}
