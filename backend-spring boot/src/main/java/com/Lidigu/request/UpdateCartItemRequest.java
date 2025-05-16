package com.Lidigu.request;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
	
	private Long cartItemId;
	private int quantity;

}
