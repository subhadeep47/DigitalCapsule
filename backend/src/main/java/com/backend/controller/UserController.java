package com.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.SearchUser;
import com.backend.model.Users;
import com.backend.service.UserService;
import com.backend.utils.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
    private UserService usersService;

    @Autowired
    private JwtUtils jwtUtil;

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
    
    @GetMapping("/search-recipient")
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

    @PostMapping(value = "/update-profile-photo", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public  ResponseEntity<?> updateProfilePhoto(@RequestBody MultipartFile file, HttpServletRequest request){
        try {
            String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            String url = usersService.updateProfilePhoto(file, email);
            return ResponseEntity.ok(Map.of("avatar", url));
        } catch (Exception e) {
            return  ResponseEntity.status(500).body("Server error: "+ e.getMessage());
        }
    }

    @PutMapping(value = "/update-profile")
    public  ResponseEntity<?> updateProfile(@RequestBody SearchUser updatedUser, HttpServletRequest request){
        try {
            String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            usersService.updateProfile(email, updatedUser);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return  ResponseEntity.status(500).body("Server error: "+ e.getMessage());
        }
    }


}
