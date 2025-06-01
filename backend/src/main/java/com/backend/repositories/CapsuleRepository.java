package com.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Capsules;

public interface CapsuleRepository extends MongoRepository<Capsules, String> {
    List<Capsules> findByOwnerId(String ownerId);
    List<Capsules> findByRecipientEmailsContains(String email);
}
