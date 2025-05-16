package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.dto.QuarryDto;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.service.QuarryService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api/quarries")
public class QuarryController {
	
	@Autowired
	private QuarryService quarryService;
	
	@Autowired
	private UserService userService;


	@GetMapping("/search")
	public ResponseEntity<List<Quarry>> findQuarryByName(
			@RequestParam String keyword) {
		List<Quarry> quarry = quarryService.searchQuarry(keyword);

		return ResponseEntity.ok(quarry);
	}


	@GetMapping()
	public ResponseEntity<List<Quarry>> getAllQuarries() {

		List<Quarry> quarries = quarryService.getAllQuarry();
		return ResponseEntity.ok(quarries);
	}
	
	
	@GetMapping("/{id}")
	public ResponseEntity<Quarry> findQuarryById(
			@PathVariable Long id) throws QuarryException {

			Quarry quarry = quarryService.findQuarryById(id);
			return ResponseEntity.ok(quarry);

	}
	@PutMapping("/{id}/add-favorites")
	public ResponseEntity<QuarryDto> addToFavorite(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long id) throws QuarryException, UserException {

			User user = userService.findUserProfileByJwt(jwt);
			QuarryDto quarry = quarryService.addToFavorites(id, user);
			return ResponseEntity.ok(quarry);

	}
}
