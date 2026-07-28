package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityComplex;
import com.epiis.reservacanchas.staticdata.EnumComplexStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryComplex extends JpaRepository<EntityComplex, String> {
    List<EntityComplex> findByStatus(EnumComplexStatus status);
}
