package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfile {

    private String userId;
    private String name;
    private String email;
    private String bio;
    private String avatar;
    private LocalDate createdAt;
    private int createdCapsulesCount;
    private int receivedCapsulesCount;

}
