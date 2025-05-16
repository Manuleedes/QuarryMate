package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Category;

public interface CategoryService {
	
	public Category createCategory (String name,Long userId) throws QuarryException;
	public List<Category> findCategoryByQuarryId(Long quarryId) throws QuarryException;
	public Category findCategoryById(Long id) throws QuarryException;

}
