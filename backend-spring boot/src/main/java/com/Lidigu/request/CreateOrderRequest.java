package com.Lidigu.request;

import com.Lidigu.model.Address;

import lombok.Data;

@Data
public class CreateOrderRequest {
 
	private Long quarryId;
	
	private Address deliveryAddress;
	
    
}
