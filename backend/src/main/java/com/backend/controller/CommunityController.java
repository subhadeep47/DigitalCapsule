package com.backend.controller;

import com.backend.dto.PublicProfile;
import com.backend.dto.SearchUser;
import com.backend.service.CommunityService;
import com.backend.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private JwtUtils jwtUtil;

    @Autowired
    private CommunityService communityService;

    @GetMapping("/search-profile")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            List<SearchUser> searchUsers = communityService.searchUsers(query, email);
            return ResponseEntity.ok(searchUsers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Search failed: " + e.getMessage());
        }
    }

    @GetMapping("/public-profile")
    public ResponseEntity<?> getPublicProfile(@RequestParam("userId") String id, HttpServletRequest request){
        try {
            String token = jwtUtil.extractJwtFromCookies(request);
            if (token == null) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String email = jwtUtil.extractEmail(token);
            PublicProfile publicProfile = communityService.getPublicProfileInfo(id);
            return ResponseEntity.ok(publicProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Search failed: " + e.getMessage());
        }
    }

}
