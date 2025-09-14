package com.backend.service;

import com.backend.dto.PublicProfile;
import com.backend.dto.SearchUser;
import com.backend.model.Users;
import com.backend.repositories.UserRepository;
import com.backend.utils.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Utility utility;

    public List<SearchUser> searchUsers(String query, String email) {
        Users currentUser = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Users> queriedUsers = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        List<SearchUser> searchUsers = new ArrayList<SearchUser>();

        for(Users user: queriedUsers) {
            if(!user.getEmail().equals(currentUser.getEmail())) {
                SearchUser searchUser = new SearchUser();
                searchUser.setUserId(user.getId());
                searchUser.setEmail(user.getEmail());
                searchUser.setName(user.getName());
                searchUser.setCreatedAt(user.getCreatedAt());
                searchUser.setAvatar(Optional.ofNullable(user.getProfilePictureUrl()).orElseGet(() -> utility.getInitials(user.getName())));
                searchUsers.add(searchUser);
            }
        }
        return searchUsers;
    }

    public PublicProfile getPublicProfileInfo(String id) {

        Users user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        PublicProfile publicProfile = new PublicProfile();
        publicProfile.setUserId(user.getId());
        publicProfile.setEmail(user.getEmail());
        publicProfile.setName(user.getName());
        publicProfile.setBio(user.getBio());
        publicProfile.setCreatedAt(user.getCreatedAt());
        publicProfile.setAvatar(Optional.ofNullable(user.getProfilePictureUrl()).orElseGet(() -> utility.getInitials(user.getName())));
        publicProfile.setCreatedCapsulesCount(Optional.ofNullable(user.getCreatedCapsuleIds()).map(List::size).orElse(0));
        publicProfile.setReceivedCapsulesCount(Optional.ofNullable(user.getReceivedCapsuleIds()).map(List::size).orElse(0));

        return publicProfile;
    }
}
