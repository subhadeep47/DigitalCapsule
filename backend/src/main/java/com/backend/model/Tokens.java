package com.backend.model;

import com.backend.model.enums.TokenType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tokens {

    @Id
    private String id;

    private String userId;
    private String token;
    private TokenType type;
    private LocalDateTime expiresAt;
    private boolean consumed;
    private LocalDateTime createdAt = LocalDateTime.now();

}
