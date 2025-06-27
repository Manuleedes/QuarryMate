package com.Lidigu.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.Lidigu.domain.PricingUnit;
import com.Lidigu.model.Quarry;
import com.Lidigu.repository.materialRepository;
import com.Lidigu.request.MaterialCalculationRequest;
import com.Lidigu.service.CategoryService;
import com.Lidigu.service.QuarryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
	@Autowired
	private materialRepository repository;

	@PostMapping()
	public ResponseEntity<?> createItem(
			@RequestBody CreateMaterialRequest item,
			@RequestHeader("Authorization") String jwt)
			throws MaterialException, UserException, QuarryException {

		System.out.println("req-controller ---- " + item);

		User user = userService.findUserProfileByJwt(jwt);

		// Find quarry by ID
		Quarry quarry = quarryService.findQuarryById(item.getQuarryId());

		// Set default pricing unit if not provided
		if (item.getPricingUnit() == null) {
			item.setPricingUnit(PricingUnit.TONNE);
		}

		// Create material with updated pricing unit logic
		Material createdMaterial = menuItemService.createMaterial(item, item.getCategory(), quarry);

		return ResponseEntity.ok(createdMaterial);
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

	@PostMapping("/calculate")
	public ResponseEntity<?> calculatePriceAndLorries(@RequestBody MaterialCalculationRequest request) {
		try {
			if (request == null || request.getMenuItemId() == null) {
				return ResponseEntity.badRequest().body(Map.of(
						"error", "Material ID is required",
						"field", "menuItemId"
				));
			}

			if (request.getQuantity() <= 0) {
				return ResponseEntity.badRequest().body(Map.of(
						"error", "Quantity must be greater than 0",
						"field", "quantity"
				));
			}

			Optional<Material> materialOpt = repository.findById(request.getMenuItemId());
			if (materialOpt.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
						"error", "Material not found",
						"materialId", request.getMenuItemId()
				));
			}

			Material material = materialOpt.get();
			double quantity = request.getQuantity();
			double price;
			int lorries;

			// Calculate based on pricing unit
			if (material.getPricingUnit() == PricingUnit.PIECE) {
				price = quantity * material.getPricePerUnit(); // Price per piece
				int piecesPerLorry = material.getMaterialCategory() != null &&
						material.getMaterialCategory().getName().toLowerCase().contains("block") ?
						500 : 1000; // Adjust pieces per lorry based on material type
				lorries = (int) Math.ceil(quantity / piecesPerLorry);
			} else {
				price = quantity * material.getPricePerUnit(); // Price per tonne
				double tonnesPerLorry = 18.0;
				lorries = (int) Math.ceil(quantity / tonnesPerLorry);
			}

			Map<String, Object> result = new HashMap<>();
			result.put("materialId", request.getMenuItemId());
			result.put("price", (long) price);
			result.put("pricePerUnit", material.getPricePerUnit());
			result.put("pricingUnit", material.getPricingUnit().toString());
			result.put("lorriesRequired", lorries);
			result.put("quantity", quantity);
			result.put("transportCostPerLorry", 25000); // Made this explicit in the response
			result.put("totalTransportCost", lorries * 25000L);
			result.put("totalCost", (long) price + (lorries * 25000L));

			return ResponseEntity.ok(result);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Calculation failed: " + e.getMessage()));
		}
	}



	
	

}
