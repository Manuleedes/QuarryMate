package com.Lidigu.service;

import java.util.List;

import com.stripe.exception.StripeException;
import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.OrderException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Order;
import com.Lidigu.model.PaymentResponse;
import com.Lidigu.model.User;
import com.Lidigu.request.CreateOrderRequest;

public interface OrderService {
	
	 public PaymentResponse createOrder(CreateOrderRequest order, User user) throws UserException, QuarryException, CartException, StripeException;
	 
	 public Order updateOrder(Long orderId, String orderStatus) throws OrderException;
	 
	 public void cancelOrder(Long orderId) throws OrderException;
	 
	 public List<Order> getUserOrders(Long userId) throws OrderException;
	 
	 public List<Order> getOrdersOfQuarry(Long quarryId, String orderStatus) throws OrderException, QuarryException;
	 

}
