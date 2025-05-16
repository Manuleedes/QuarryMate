package com.Lidigu.controller;

import java.util.List;

import com.Lidigu.model.Quarry;
import com.Lidigu.service.CategoryService;
import com.Lidigu.service.QuarryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.MaterialException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Material;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateMaterialRequest;
import com.Lidigu.service.MaterialService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api/admin/material")
public class AdminMenuItemController {
	
	@Autowired
	private MaterialService menuItemService;
	@Autowired
	private UserService userService;
	@Autowired
	private QuarryService quarryService;
	@Autowired
	private CategoryService categoryService;

	@PostMapping()
	public ResponseEntity<Material> createItem(
			@RequestBody CreateMaterialRequest item,
			@RequestHeader("Authorization") String jwt)
			throws MaterialException, UserException, QuarryException {
		System.out.println("req-controller ----"+item);
		User user = userService.findUserProfileByJwt(jwt);
//		Category category=categoryService.findCategoryById(item.getCategoryId());
		Quarry quarry= quarryService.findQuarryById(item.getQuarryId());
			Material menuItem = menuItemService.createMaterial(item,item.getCategory(),quarry);
			return ResponseEntity.ok(menuItem);

	}


	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteItem(@PathVariable Long id, @RequestHeader("Authorization") String jwt)
			throws UserException, MaterialException {
		User user = userService.findUserProfileByJwt(jwt);
		
			menuItemService.deleteMaterial(id);
			return ResponseEntity.ok("Menu item deleted");
		
	
	}

	

	@GetMapping("/search")
	public ResponseEntity<List<Material>> getMenuItemByName(@RequestParam String name)  {
		List<Material> menuItem = menuItemService.searchMaterial(name);
		return ResponseEntity.ok(menuItem);
	}
	
	
	@PutMapping("/{id}")
	public ResponseEntity<Material> updateAvailabilityStatus(
			@PathVariable Long id) throws MaterialException {
		Material menuItems= menuItemService.updateAvailabilityStatus(id);
		return ResponseEntity.ok(menuItems);
	}
	
	

}
