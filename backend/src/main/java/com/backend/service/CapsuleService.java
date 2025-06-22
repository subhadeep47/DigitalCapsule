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

import lombok.Data;

@Service
@Data
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
    	    	
    	List<Capsules> createdCapsules = Optional.ofNullable(user.getCreatedCapsuleIds())
    								.map(capsuleRepository::findAllById)
    								.orElseGet(ArrayList::new);
    	
        return createdCapsules;
    }

    public List<Capsules> getCapsulesReceivedBy(String recipientEmail) {
    	
    	Users user = userRepository.findByEmail(recipientEmail).orElseThrow(() -> new RuntimeException("User not found"));
    	
    	List<Capsules> receivedCapsules = Optional.ofNullable(user.getReceivedCapsuleIds())
    		    					.map(capsuleRepository::findAllById)
    		    					.orElseGet(ArrayList::new);
    	
        return receivedCapsules;
    }

    public Optional<Capsules> getCapsuleById(String capsuleId) {
        return capsuleRepository.findById(capsuleId);
    }

    public void deleteCapsule(String capsuleId, String email) {
        Optional<Capsules> optionalCapsule = capsuleRepository.findById(capsuleId);
        if (!optionalCapsule.isPresent()) {
            throw new RuntimeException("Capsule not found");
        }

        Capsules capsule = optionalCapsule.get();

        // Delete file attachments
        if (capsule.getFileInfo() != null) {
            for (Capsules.FileInfo file : capsule.getFileInfo()) {
            	fileService.deleteFile(file);
            }
        }

        // Remove capsule ID from creator
        userRepository.findByEmail(email).ifPresent(user -> {
        	Optional.ofNullable(user.getCreatedCapsuleIds())
            		.ifPresent(ids -> ids.remove(capsuleId));
            userRepository.save(user);
        });

        // Remove capsule ID from all recipients
        for (String recipientEmail : capsule.getRecipientEmails()) {
        	userRepository.findByEmail(recipientEmail).ifPresent(user -> {
        		Optional.ofNullable(user.getReceivedCapsuleIds())
                		.ifPresent(ids -> ids.remove(capsuleId));
                userRepository.save(user);
            });
        }

        // Delete the capsule itself
        capsuleRepository.deleteById(capsuleId);
    }
    
}
