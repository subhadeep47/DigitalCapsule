package com.backend.service;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.backend.model.enums.VisibilityType;
import com.backend.utils.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dto.SearchUser;
import com.backend.model.Users;
import com.backend.repositories.UserRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private AwsServices awsServices;


    @Autowired
    private Utility utility;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public Users getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public Users getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + email));
    }

    public void deleteUserById(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: User not found.");
        }
        userRepository.deleteById(id);
    }
    
    public List<SearchUser> searchUsers(String query, String email) {
    	Users currentUser = getUserByEmail(email);
    	List<Users> queriedUsers = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    	List<SearchUser> searchUsers = new ArrayList<SearchUser>();
    	
    	for(Users user: queriedUsers) {
    		if(!user.getEmail().equals(currentUser.getEmail()) && ( user.getVisibility() == null || user.getVisibility().equals(VisibilityType.PUBLIC_VISIBLE))) {
    			SearchUser searchUser = new SearchUser();
            	searchUser.setEmail(user.getEmail());
            	searchUser.setName(user.getName());
            	searchUser.setAvatar(utility.getInitials(user.getName()));
            	searchUsers.add(searchUser);
    		}
    	}
    	
        return searchUsers;
    }
    
    public SearchUser getCurrentUser(String email){
    	Users user = getUserByEmail(email);
    	SearchUser searchUser = new SearchUser();
    	searchUser.setEmail(email);
    	searchUser.setName(user.getName());
        searchUser.setBio(user.getBio());
        searchUser.setVerified(user.isVerified());
        searchUser.setVisibility((user.getVisibility()));
    	searchUser.setAvatar(Optional.ofNullable(user.getProfilePictureUrl()).orElseGet(() -> utility.getInitials(user.getName())));
    	searchUser.setCreatedAt(user.getCreatedAt());
    	return searchUser;
    }

    public String updateProfilePhoto(MultipartFile file, String email) throws IOException {
        Users user = getUserByEmail(email);
        if(user.getProfilePictureUrl() != null ){
            awsServices.deleteFile(user.getProfilePictureUrl());
        }
        String url = awsServices.uploadProfilePicture(file, user.getId());
        user.setProfilePictureUrl(url);
        userRepository.save(user);
        return  url;
    }

    public void updateProfile(String email, SearchUser updatedUser) throws IOException{
        Users user = getUserByEmail(email);
        user.setName(updatedUser.getName());
        user.setBio(updatedUser.getBio());
        user.setVisibility(updatedUser.getVisibility());
        userRepository.save(user);
    }
}
