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
	
	 PaymentResponse createOrder(CreateOrderRequest order, User user) throws Exception;
	 
	 Order updateOrder(Long orderId, String orderStatus) throws OrderException;
	 
	 void cancelOrder(Long orderId) throws OrderException;
	 
	 List<Order> getUserOrders(Long userId) throws OrderException;
	 
	 List<Order> getOrdersOfQuarry(Long quarryId, String orderStatus) throws OrderException, QuarryException;

	 void allocateLorriesToOrder(Order order, double totalWeight) throws Exception;

	void confirmPayment(Long orderId) throws Exception;


}
