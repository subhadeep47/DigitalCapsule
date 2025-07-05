package com.backend.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.model.SearchUser;
import com.backend.model.Users;
import com.backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users registerUser(Users user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Users authenticateUser(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }
        return userOpt.get();
    }

    public Users getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public Optional<Users> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUserById(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: User not found.");
        }
        userRepository.deleteById(id);
    }
    
    public List<SearchUser> searchUsers(String query, String email) {
    	Users currentUser = getUserByEmail(email).get();
    	List<Users> queriedUsers = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    	List<SearchUser> searchUsers = new ArrayList<SearchUser>();
    	
    	for(Users user: queriedUsers) {
    		if(!user.getEmail().equals(currentUser.getEmail())) {
    			SearchUser searchUser = new SearchUser();
            	searchUser.setEmail(user.getEmail());
            	searchUser.setName(user.getName());
            	searchUser.setAvatar(getInitials(user.getName()));
            	searchUsers.add(searchUser);
    		}
    	}
    	
        return searchUsers;
    }
    
    public SearchUser getCurrentUser(String email){
    	Users user = getUserByEmail(email).get();
    	SearchUser searchUser = new SearchUser();
    	searchUser.setEmail(email);
    	searchUser.setName(user.getName());
    	searchUser.setAvatar(getInitials(user.getName()));
    	return searchUser;
    }
    
    public String getInitials(String name) {
    	String[] names = name.split(" ");
    	char firstInitial = names[0].toUpperCase().charAt(0);
    	return names.length > 1 ? "" + firstInitial + names[names.length - 1].toUpperCase().charAt(0) : "" + firstInitial + firstInitial;
    }
}
