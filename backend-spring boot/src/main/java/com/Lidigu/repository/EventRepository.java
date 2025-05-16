package com.Lidigu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.Events;

public interface EventRepository extends JpaRepository<Events, Long>{

	public List<Events> findEventsByQuarryId(Long id);
}
