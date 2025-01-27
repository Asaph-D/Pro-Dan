package com.example.patisserie.test;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.example.patisserie.models.Role;
import com.example.patisserie.models.RoleName;
import com.example.patisserie.repositories.RoleRepository;

@Component
public class DataLoader {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(RoleName.ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(RoleName.ADMIN);
                roleRepository.save(adminRole);
            }
            if (roleRepository.findByName(RoleName.USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(RoleName.USER);
                roleRepository.save(userRole);
            }
        };
    }
}

