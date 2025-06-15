package com.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.Capsules;
import com.backend.model.Users;
import com.backend.repositories.CapsuleRepository;
import com.backend.repositories.UserRepository;

@Service
public class CapsuleService {
	
	@Autowired
    private CapsuleRepository capsuleRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private FileService fileService;

    public Capsules createCapsule(Capsules capsule, List<MultipartFile> files, String email) throws IOException {
    	
    	if(files != null) {
    		List<Capsules.FileInfo> fileMetas = new ArrayList<>();
            for (MultipartFile file : files) {
                fileMetas.add(fileService.storeFile(file));
            }
            capsule.setFileInfo(fileMetas);
    	}
    	
        capsule.setCreatedBy(email);
        capsule.setCreatedAt(LocalDateTime.now());

        Capsules saved = capsuleRepository.save(capsule);

        userRepository.findByEmail(capsule.getCreatedBy()).ifPresent(creator -> {
        	if(creator.getCreatedCapsuleIds() == null) {
        		List<String> createdCapList = new ArrayList<String>();
        		createdCapList.add(saved.getId());
        		creator.setCreatedCapsuleIds(createdCapList);
        	}else {
        		creator.getCreatedCapsuleIds().add(saved.getId());
        	}
        	
            userRepository.save(creator);
        });

        for (String recipentEmail : capsule.getRecipientEmails()) {
            userRepository.findByEmail(recipentEmail).ifPresent(recipient -> {
            	if(recipient.getReceivedCapsuleIds() == null) {
            		List<String> receivedCapList = new ArrayList<String>();
            		receivedCapList.add(saved.getId());
            		recipient.setReceivedCapsuleIds(receivedCapList);
            	}else {
            		recipient.getReceivedCapsuleIds().add(saved.getId());
            	}
            	
                userRepository.save(recipient);
                //emailService.sendCapsuleCreatedNotification(email, capsule);
            });
        }
        return saved;
    }

    public List<Capsules> getCapsulesCreatedBy(String creatorEmail) {
    	
    	Users user = userRepository.findByEmail(creatorEmail).orElseThrow(() -> new RuntimeException("User not found"));
    	
    	List<Capsules> createdCapsules;
    	
    	if(user.getCreatedCapsuleIds() == null) {
    		createdCapsules = new ArrayList<Capsules>();
    	}else {
    		createdCapsules = capsuleRepository.findAllById(user.getCreatedCapsuleIds());
    	}
    	
        return createdCapsules;
    }

    public List<Capsules> getCapsulesReceivedBy(String recipientEmail) {
    	
    	Users user = userRepository.findByEmail(recipientEmail).orElseThrow(() -> new RuntimeException("User not found"));
    	
    	List<Capsules> receivedCapsules;
    	
    	if(user.getReceivedCapsuleIds() == null) {
    		receivedCapsules = new ArrayList<Capsules>();
    	}else {
    		receivedCapsules = capsuleRepository.findAllById(user.getReceivedCapsuleIds());
    	}
    	
        return receivedCapsules;
    }

    public Optional<Capsules> getCapsuleById(String capsuleId) {
        return capsuleRepository.findById(capsuleId);
    }

    public void deleteCapsule(String capsuleId, String email) {
        capsuleRepository.deleteById(capsuleId);
    }
    
}
