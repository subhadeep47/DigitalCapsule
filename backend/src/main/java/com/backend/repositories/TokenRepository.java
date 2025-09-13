package com.backend.repositories;

import com.backend.model.Tokens;
import com.backend.model.enums.TokenType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TokenRepository extends MongoRepository<Tokens, String> {

    Optional<Tokens> findByTokenAndType(String token, TokenType type);

    void deleteByUserIdAndType(String userId, TokenType type);

}
