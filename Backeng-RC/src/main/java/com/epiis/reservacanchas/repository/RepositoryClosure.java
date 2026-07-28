package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityClosure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryClosure extends JpaRepository<EntityClosure, String> {
    List<EntityClosure> findByComplexId(String complexId);
}
