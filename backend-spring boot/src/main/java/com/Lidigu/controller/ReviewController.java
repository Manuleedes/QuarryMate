package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Lidigu.Exception.ReviewException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Review;
import com.Lidigu.model.User;
import com.Lidigu.request.ReviewRequest;
import com.Lidigu.service.ReviewSerive;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api")
public class ReviewController {
	@Autowired
	private ReviewSerive reviewService;
	@Autowired
	private UserService userService;
	
	@PostMapping("/review")
	public ResponseEntity<Review> createReview(@RequestBody ReviewRequest review,@RequestHeader("Authorization") String jwt) throws UserException{
		User user =userService.findUserProfileByJwt(jwt);
		Review submitedReview = reviewService.submitReview(review,user);
		return ResponseEntity.ok(submitedReview);
	}

	  

	    @DeleteMapping("/delete/{reviewId}")
	    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) throws ReviewException {
	        reviewService.deleteReview(reviewId);
	        return new ResponseEntity<>("Review deleted successfully", HttpStatus.OK);
	    }

	    @GetMapping("/average-rating")
	    public ResponseEntity<Double> calculateAverageRating(@RequestBody List<Review> reviews) {
	        double averageRating = reviewService.calculateAverageRating(reviews);
	        return new ResponseEntity<>(averageRating, HttpStatus.OK);
	    }
	}



