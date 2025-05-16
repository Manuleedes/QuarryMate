package com.Lidigu.controller;

import java.util.List;

import com.Lidigu.Exception.UserException;
import com.Lidigu.model.User;
import com.Lidigu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.model.Category;
import com.Lidigu.service.CategoryService;

@RestController
@RequestMapping("/api")
public class CategoryController {
	
	@Autowired
	public CategoryService categoryService;

	@Autowired
	public UserService userService;
	
	@PostMapping("/admin/category")
	public ResponseEntity<Category> createdCategory(
			@RequestHeader("Authorization")String jwt,
			@RequestBody Category category) throws QuarryException, UserException {
		User user=userService.findUserProfileByJwt(jwt);
		
		Category createdCategory=categoryService.createCategory(category.getName(), user.getId());
		return new ResponseEntity<Category>(createdCategory,HttpStatus.OK);
	}
	
	@GetMapping("/category/quarry/{id}")
	public ResponseEntity<List<Category>> getQuarriesCategory(
			@PathVariable Long id,
			@RequestHeader("Authorization")String jwt) throws QuarryException, UserException {
		User user=userService.findUserProfileByJwt(jwt);
		List<Category> categories=categoryService.findCategoryByQuarryId(id);
		return new ResponseEntity<>(categories,HttpStatus.OK);
	}

}
