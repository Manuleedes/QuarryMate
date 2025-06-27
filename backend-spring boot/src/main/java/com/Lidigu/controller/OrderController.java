package com.Lidigu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.OrderException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Order;
import com.Lidigu.model.PaymentResponse;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateOrderRequest;
import com.Lidigu.service.OrderService;
import com.Lidigu.service.UserService;

@RestController
@RequestMapping("/api")
public class OrderController {
	@Autowired
	private OrderService orderService;
	@Autowired
	private UserService userService;

	@PostMapping("/order")
	public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest order,
										 @RequestHeader("Authorization") String jwt) {
		try {
			User user = userService.findUserProfileByJwt(jwt);
			if(order != null) {
				PaymentResponse res = orderService.createOrder(order, user);
				return ResponseEntity.ok(res);
			} else {
				throw new OrderException("Please provide valid request body");
			}
		} catch (Exception e) {
			if (e.getMessage().contains("No available lorries")) {
				return ResponseEntity
						.status(HttpStatus.SERVICE_UNAVAILABLE)
						.body("Currently no lorries are available to fulfill your order. Please try again later.");
			}
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while processing your order: " + e.getMessage());
		}
	}


	@GetMapping("/order/user")
    public ResponseEntity<List<Order>> getAllUserOrders(
			@RequestHeader("Authorization") String jwt) throws OrderException, UserException{
    	User user=userService.findUserProfileByJwt(jwt);
    	
    	if(user.getId()!=null) {
    	List<Order> userOrders = orderService.getUserOrders(user.getId());
    	return ResponseEntity.ok(userOrders);
    	}else {
    		return new ResponseEntity<List<Order>>(HttpStatus.BAD_REQUEST);
    	}
    }
    

    

	
}
