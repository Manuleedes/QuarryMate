package com.Lidigu.repository;

import com.Lidigu.model.Lorry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LorryRepository extends JpaRepository<Lorry, Long> {
    @Query("SELECT l FROM Lorry l WHERE l.available = true ORDER BY l.allocationCost DESC")
    List<Lorry> findAvailableLorriesOrderedByCapacityDesc();
    List<Lorry> findByQuarryId(Long quarryId);

    List<Lorry> findByNumberPlateContainingIgnoreCase(String plateNumber);
}
