package com.Lidigu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Category;
import com.Lidigu.model.Quarry;
import com.Lidigu.repository.CategoryRepository;

@Service
public class CategoryServiceImplementation implements CategoryService {
	
	@Autowired
	private QuarryService quarryService;
	
	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public Category createCategory(String name,Long userId) throws QuarryException {
		Quarry quarry=quarryService.getQuarriesByUserId(userId);
		Category createdCategory=new Category();
		
		createdCategory.setName(name);
		createdCategory.setQuarry(quarry);
		return categoryRepository.save(createdCategory);
	}

	@Override
	public List<Category> findCategoryByQuarryId(Long id) throws QuarryException {
		Quarry quarry=quarryService.findQuarryById(id);
		return categoryRepository.findByQuarryId(id);
	}

	@Override
	public Category findCategoryById(Long id) throws QuarryException {
		Optional<Category> opt=categoryRepository.findById(id);
		
		if(opt.isEmpty()) {
			throw new QuarryException("category not exist with id "+id);
		}
		
		return opt.get();
	}

}
