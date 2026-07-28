package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryTransaction extends JpaRepository<EntityTransaction, String> {
    List<EntityTransaction> findByComplexId(String complexId);
}
