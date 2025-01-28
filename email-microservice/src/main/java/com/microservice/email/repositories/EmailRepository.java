package com.microservice.email.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.email.models.EmailModel;

import java.util.UUID;

public interface EmailRepository extends JpaRepository<EmailModel, UUID>{

}
