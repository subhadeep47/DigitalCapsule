package com.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Users;

public interface UserRepository extends MongoRepository<Users, String> {
    Optional<Users> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Users> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name);
}
