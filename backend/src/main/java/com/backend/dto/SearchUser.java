package com.backend.dto;

import java.time.LocalDate;

import com.backend.model.enums.VisibilityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchUser {

	private String userId;
	private String name;
	private String email;
	private boolean verified;
	private VisibilityType visibility;
	private String bio;
	private String avatar;
	private LocalDate createdAt;
}
