package com.backend.model;

import java.time.LocalDate;
import java.util.List;

import com.backend.model.enums.VisibilityType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
	
	@Id
	private String id;
    private String name;
    private String email;
    private String password;
    private boolean verified;
    private VisibilityType visibility;
    private String bio;
    private LocalDate createdAt;
    private String profilePictureUrl;
    private List<String> createdCapsuleIds;
    private List<String> receivedCapsuleIds;
}
