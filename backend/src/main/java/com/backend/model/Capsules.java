package com.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "capsules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Capsules {
	
	@Id
	private String id;
    private String title;
    private String content;
    private String ownerId; // userId of the creator
    private LocalDateTime unlockDate;
    private boolean isPublic;
    private List<String> recipientEmails; // email addresses of recipients
    private LocalDateTime createdAt;

}
