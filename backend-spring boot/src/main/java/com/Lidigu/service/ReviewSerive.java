package com.Lidigu.service;

import java.util.List;

import com.Lidigu.Exception.ReviewException;
import com.Lidigu.model.Review;
import com.Lidigu.model.User;
import com.Lidigu.request.ReviewRequest;

public interface ReviewSerive {
	
     Review submitReview(ReviewRequest review,User user);
     void deleteReview(Long reviewId) throws ReviewException;
     double calculateAverageRating(List<Review> reviews);
}
