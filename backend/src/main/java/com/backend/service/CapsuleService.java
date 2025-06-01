package com.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.model.Capsules;
import com.backend.repositories.CapsuleRepository;

@Service
public class CapsuleService {
	
	@Autowired
    private CapsuleRepository capsuleRepository;

    public Capsules createCapsule(Capsules capsule, String email) {
        return capsuleRepository.save(capsule);
    }

    public List<Capsules> getCapsulesCreatedBy(String creatorEmail) {
        return capsuleRepository.findByOwnerId(creatorEmail);
    }

    public List<Capsules> getCapsulesReceivedBy(String recipientEmail) {
        return capsuleRepository.findByRecipientEmailsContains(recipientEmail);
    }

    public Optional<Capsules> getCapsuleById(String capsuleId) {
        return capsuleRepository.findById(capsuleId);
    }

    public void deleteCapsule(String capsuleId, String email) {
        capsuleRepository.deleteById(capsuleId);
    }

    public Capsules updateCapsule(String capsuleId, Capsules updatedCapsule) {
    	 Optional<Capsules> existingOpt = capsuleRepository.findById(capsuleId);
    	    if (existingOpt.isPresent()) {
    	        Capsules existing = existingOpt.get();
    	        existing.setTitle(updatedCapsule.getTitle());
    	        existing.setContent(updatedCapsule.getContent());
    	        existing.setUnlockDate(updatedCapsule.getUnlockDate());
    	        existing.setRecipientEmails(updatedCapsule.getRecipientEmails());
    	        existing.setPublic(updatedCapsule.isPublic());
    	        return capsuleRepository.save(existing);
    	    } else {
    	        throw new RuntimeException("Capsule not found with id: " + capsuleId);
    	    }
    }
    
}
