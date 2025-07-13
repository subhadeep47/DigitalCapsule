package com.backend.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Capsules;

public interface CapsuleRepository extends MongoRepository<Capsules, String> {
    List<Capsules> findByCreatedBy(String createdBy);
    List<Capsules> findByRecipientEmailsContains(String email);
    Page<Capsules> findByIdIn(List<String> ids, Pageable pageable);

}
