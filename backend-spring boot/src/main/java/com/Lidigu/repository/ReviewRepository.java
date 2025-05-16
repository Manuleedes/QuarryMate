package com.Lidigu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
