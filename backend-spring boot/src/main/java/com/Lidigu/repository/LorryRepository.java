package com.Lidigu.repository;

import com.Lidigu.model.Lorry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LorryRepository extends JpaRepository<Lorry, Long> {
    @Query("SELECT l FROM Lorry l WHERE l.available = true ORDER BY l.capacityInTonnes DESC")
    List<Lorry> findAvailableLorriesOrderedByCapacityDesc();

}
