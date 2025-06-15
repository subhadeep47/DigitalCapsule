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
    private String description;
    private String personalMessage;
    private String createdBy;
    private LocalDateTime dateToUnlock;
    private List<String> recipientEmails; // email addresses of recipients
    private LocalDateTime createdAt;
    private List<FileInfo> fileInfo;
    
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class FileInfo{
    	private String fileName;
    	private double fileSize;
    	private String fileId;
    }

}
