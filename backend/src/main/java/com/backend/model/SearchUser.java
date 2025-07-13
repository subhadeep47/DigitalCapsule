package com.backend.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchUser {
	private String name;
	private String email;
	private String avatar;
	private  LocalDate createdAt;
}
