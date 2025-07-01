package com.Lidigu.repository;

import java.util.List;
import java.util.Optional;

import com.Lidigu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.Lidigu.model.Quarry;
import org.springframework.data.repository.query.Param;

public interface QuarryRepository extends JpaRepository<Quarry, Long> {

//	@Query("SELECT r FROM Quarry r WHERE lower(r.name) LIKE lower(concat('%', :query, '%')) OR lower(r.cuisineType) LIKE lower(concat('%', :query, '%'))")
//	List<Quarry> findBySearchQuery(String query);
	@Query("SELECT r FROM Quarry r WHERE lower(r.name) LIKE lower(concat('%', :query, '%'))")
	List<Quarry> findBySearchQuery(@Param("query") String query);

	Quarry findByOwnerId(Long userId);

	Optional<Quarry> findByOwner(User user);
}
