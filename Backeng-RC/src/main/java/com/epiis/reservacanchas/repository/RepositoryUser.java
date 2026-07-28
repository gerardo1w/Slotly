package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RepositoryUser extends JpaRepository<EntityUser, String> {
    Optional<EntityUser> findByEmail(String email);
}
