package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Category;

public interface CategoryService {
	
	 Category createCategory (String name,Long userId) throws QuarryException;
	 List<Category> findCategoryByQuarryId(Long quarryId) throws QuarryException;
	 Category findCategoryById(Long id) throws QuarryException;

}
