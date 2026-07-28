package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityPitch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryPitch extends JpaRepository<EntityPitch, String> {
    List<EntityPitch> findByComplexId(String complexId);
}
