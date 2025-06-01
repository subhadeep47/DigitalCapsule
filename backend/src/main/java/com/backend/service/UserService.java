package com.backend.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.model.Users;
import com.backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Register a new user
    public Users registerUser(Users user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    // ✅ Authenticate a user (login)
    public Users authenticateUser(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }
        return userOpt.get();
    }

    // ✅ Get user by ID
    public Users getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ✅ Get user by Email
    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ✅ Delete a user
    public void deleteUserById(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: User not found.");
        }
        userRepository.deleteById(id);
    }
    
    public List<Users> searchUsers(String query) {
        return userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    }
    // Add more features as needed
}
