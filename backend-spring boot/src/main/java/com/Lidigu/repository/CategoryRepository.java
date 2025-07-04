package com.Lidigu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	public List<Category> findByQuarryId(Long id);
}
