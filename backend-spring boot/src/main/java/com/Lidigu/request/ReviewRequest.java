package com.Lidigu.request;

import lombok.Data;

@Data
public class ReviewRequest {

    private Long quarryId;
    
    private double rating;
    
    private String reviewText;

	
}
