package com.backend.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.backend.dto.SummaryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.Capsules;
import com.backend.model.Users;
import com.backend.repositories.CapsuleRepository;
import com.backend.repositories.UserRepository;
import com.backend.utils.EncryptionUtils;

import lombok.Data;

@Service
@Data
public class CapsuleService {
	
	@Autowired
    private CapsuleRepository capsuleRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private EncryptionUtils encryptionUtils;
	
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
    	
    	if(capsule.getPersonalMessage() != null) {
    		try {
                capsule.setPersonalMessage(encryptionUtils.encrypt(capsule.getPersonalMessage()));
            } catch (Exception e) {
                capsule.setPersonalMessage(null); // fallback to hide on error
            }
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

    public Page<Capsules> getCapsulesCreatedBy(String creatorEmail, int page, int limit) {
        Users user = userRepository.findByEmail(creatorEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> createdCapsuleIds = Optional.ofNullable(user.getCreatedCapsuleIds())
                                                 .orElse(Collections.emptyList());

        if (createdCapsuleIds.isEmpty()) {
            return Page.empty();
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("dateToUnlock").descending());

        Page<Capsules> pageResult = capsuleRepository.findByIdIn(createdCapsuleIds, pageable);

        pageResult.getContent().forEach(this::decryptIfUnlocked);

        return pageResult;
    }

    public Page<Capsules> getCapsulesReceivedBy(String recipientEmail, int page, int limit) {
        Users user = userRepository.findByEmail(recipientEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> receivedCapsuleIds = Optional.ofNullable(user.getReceivedCapsuleIds())
                                                  .orElse(Collections.emptyList());

        if (receivedCapsuleIds.isEmpty()) {
            return Page.empty();
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("dateToUnlock").descending());

        Page<Capsules> pageResult = capsuleRepository.findByIdIn(receivedCapsuleIds, pageable);

        pageResult.getContent().forEach(this::decryptIfUnlocked);

        return pageResult;
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
    
    private void decryptIfUnlocked(Capsules capsule) {
        if (capsule.getPersonalMessage() != null && isUnlocked(capsule.getDateToUnlock())) {
            try {
                capsule.setPersonalMessage(encryptionUtils.decrypt(capsule.getPersonalMessage()));
            } catch (Exception e) {
                capsule.setPersonalMessage(null); // fallback to hide on error
            }
        } else {
            capsule.setPersonalMessage(null); // hide message if locked
            capsule.setFileInfo(null);      
        }
    }

    private boolean isUnlocked(LocalDate dateToUnlock) {
    	LocalDate today = LocalDate.now();
        return !dateToUnlock.isAfter(today);
    }

    public SummaryResponse getDashboardSummary(String email) {
        Users user = userRepository.findByEmail(email).orElseThrow(() ->
                new RuntimeException("User not found"));

        List<Capsules> createdCapsules = Optional.ofNullable(user.getCreatedCapsuleIds())
                .stream()
                .flatMap(List::stream)
                .flatMap(capsuleId -> capsuleRepository.findById(capsuleId).stream())
                .peek(this::decryptIfUnlocked)
                .toList();

        List<Capsules> receivedCapsules = Optional.ofNullable(user.getReceivedCapsuleIds())
                .stream()
                .flatMap(List::stream)
                .flatMap(capsuleId -> capsuleRepository.findById(capsuleId).stream())
                .peek(this::decryptIfUnlocked)
                .toList();

        int createdCapsulesCount = createdCapsules.size();
        int receivedCapsulesCount = receivedCapsules.size();
        int totalCapsulesCount = createdCapsulesCount + receivedCapsulesCount;

        return new SummaryResponse();
    }
}
