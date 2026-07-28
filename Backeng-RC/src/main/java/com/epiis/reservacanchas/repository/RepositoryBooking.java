package com.epiis.reservacanchas.repository;

import com.epiis.reservacanchas.entity.EntityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryBooking extends JpaRepository<EntityBooking, String> {
    List<EntityBooking> findByClientEmail(String clientEmail);
    List<EntityBooking> findByComplexId(String complexId);
}
