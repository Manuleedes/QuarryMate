package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.MaterialException;
import com.Lidigu.model.Material;
import com.Lidigu.service.MaterialService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api/material")
public class MenuItemController {
	@Autowired
	private MaterialService menuItemService;
	
	@Autowired
	private UserService userService;


	@GetMapping("/search")
	public ResponseEntity<List<Material>> searchFood(
			@RequestParam String name)  {
		List<Material> menuItem = menuItemService.searchMaterial(name);
		return ResponseEntity.ok(menuItem);
	}
	@GetMapping("/quarry/{quarryId}")
	public ResponseEntity<List<Material>> getMenuItemByQuarryId(
			@PathVariable Long quarryId,
			@RequestParam(required = false) String material_category) throws MaterialException {
		List<Material> menuItems= menuItemService.getQuarryMaterial(
				quarryId,material_category);
		return ResponseEntity.ok(menuItems);
	}
	


}
