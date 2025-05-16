package com.Lidigu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.Lidigu.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	
	
	@Query("SELECT u FROM User u Where u.status='PENDING'")
	public List<User> getPenddingQuaryOwners();
	
	public User findByEmail(String username);

}
