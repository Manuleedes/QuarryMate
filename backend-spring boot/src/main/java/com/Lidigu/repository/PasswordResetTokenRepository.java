package com.Lidigu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
	PasswordResetToken findByToken(String token);
}
