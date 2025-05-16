package com.Lidigu.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateQuarryRequest;
import com.Lidigu.response.ApiResponse;
import com.Lidigu.service.QuarryService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api/admin/quarries")
public class AdminQuarryController {
	@Autowired
	private QuarryService quarryService;
	
	@Autowired
	private UserService userService;

	@PostMapping()
	public ResponseEntity<Quarry> createQuarry(
			@RequestBody CreateQuarryRequest req,
			@RequestHeader("Authorization") String jwt) throws UserException {

			User user = userService.findUserProfileByJwt(jwt);
		
			System.out.println("----TRUE___-----"+jwt);
			Quarry quarry = quarryService.createQuarry(req,user);
			return ResponseEntity.ok(quarry);
	}


	@PutMapping("/{id}")
	public ResponseEntity<Quarry> updateQuarry(@PathVariable Long id, @RequestBody CreateQuarryRequest req,
											   @RequestHeader("Authorization") String jwt) throws QuarryException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		
			Quarry quarry = quarryService.updateQuarry(id, req);
			return ResponseEntity.ok(quarry);
		
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse> deleteQuarryById(@PathVariable("id") Long quarryId,
			@RequestHeader("Authorization") String jwt) throws QuarryException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		
			quarryService.deleteQuarry(quarryId);
			
			ApiResponse res=new ApiResponse("Quarry Deleted with id Successfully",true);
			return ResponseEntity.ok(res);
	}

	
	@PutMapping("/{id}/status")
	public ResponseEntity<Quarry> updateQuarryStatus(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long id) throws QuarryException, UserException {
		
			Quarry quarry = quarryService.updateQuarryStatus(id);
			return ResponseEntity.ok(quarry);

	}

	@GetMapping("/user")
	public ResponseEntity<Quarry> findQuarryByUserId(
			@RequestHeader("Authorization") String jwt) throws QuarryException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Quarry quarry = quarryService.getQuarriesByUserId(user.getId());
		return ResponseEntity.ok(quarry);

	}
	
	

}
