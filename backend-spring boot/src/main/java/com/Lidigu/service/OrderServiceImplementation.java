package com.Lidigu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.OrderException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
import com.Lidigu.model.Address;
import com.Lidigu.model.Cart;
import com.Lidigu.model.CartItem;
import com.Lidigu.model.Notification;
import com.Lidigu.model.Order;
import com.Lidigu.model.OrderItem;
import com.Lidigu.model.PaymentResponse;
import com.Lidigu.model.Quarry;
import com.Lidigu.model.User;
import com.Lidigu.repository.AddressRepository;
import com.Lidigu.repository.OrderItemRepository;
import com.Lidigu.repository.OrderRepository;
import com.Lidigu.repository.QuarryRepository;
import com.Lidigu.repository.UserRepository;
import com.Lidigu.request.CreateOrderRequest;
@Service
public class OrderServiceImplementation implements OrderService {
	
	@Autowired
	private AddressRepository addressRepository;
	@Autowired
	private CartSerive cartService;
	@Autowired
	private OrderItemRepository orderItemRepository;
	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private QuarryRepository quarryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PaymentService paymentSerive;
	
	@Autowired
	private NotificationService notificationService;
	

	

	@Override
	public PaymentResponse createOrder(CreateOrderRequest order,User user) throws UserException, QuarryException, CartException, StripeException {
		
	    Address shippAddress = order.getDeliveryAddress();

	    
	    Address savedAddress = addressRepository.save(shippAddress);
	    
	    if(!user.getAddresses().contains(savedAddress)) {
	    	user.getAddresses().add(savedAddress);
	    }
	    
		
		System.out.println("user addresses --------------  "+user.getAddresses());
		   
		 userRepository.save(user);
	    
	    Optional<Quarry> quarry = quarryRepository.findById(order.getQuarryId());
	    if(quarry.isEmpty()) {
	    	throw new QuarryException("Restaurant not found with id "+order.getQuarryId());
	    }
	    
	    Order createdOrder = new Order();
	    
	    createdOrder.setCustomer(user);
	    createdOrder.setDeliveryAddress(savedAddress);
	    createdOrder.setCreatedAt(new Date());
	    createdOrder.setOrderStatus("PENDING");
	    createdOrder.setQuarry(quarry.get());

        Cart cart = cartService.findCartByUserId(user.getId());
        
	    List<OrderItem> orderItems = new ArrayList<>();
	    
	    for (CartItem cartItem : cart.getItems()) {
	        OrderItem orderItem = new OrderItem();
	       orderItem.setMaterial(cartItem.getMaterial());
	       orderItem.setQuantity(cartItem.getQuantity());
	        orderItem.setTotalPrice(cartItem.getMaterial().getPrice()* cartItem.getQuantity());

	        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
	        orderItems.add(savedOrderItem);
	    }
   
	     Long totalPrice = cartService.calculateCartTotals(cart);

	    createdOrder.setTotalAmount(totalPrice);
	    createdOrder.setQuarry(quarry.get());
  
	    createdOrder.setItems(orderItems);
	    Order savedOrder = orderRepository.save(createdOrder);

	   quarry.get().getOrders().add(savedOrder);
	   
	   quarryRepository.save(quarry.get());
	   

	   
	   PaymentResponse res=paymentSerive.generatePaymentLink(savedOrder);
	   return res;

	}

	@Override
	public void cancelOrder(Long orderId) throws OrderException {
           Order order =findOrderById(orderId);
           if(order==null) {
        	   throw new OrderException("Order not found with the id "+orderId);
           }
		
		    orderRepository.deleteById(orderId);
		
	}
	
	public Order findOrderById(Long orderId) throws OrderException {
		Optional<Order> order = orderRepository.findById(orderId);
		if(order.isPresent()) return order.get();
		
		throw new OrderException("Order not found with the id "+orderId);
	}

	@Override
	public List<Order> getUserOrders(Long userId) throws OrderException {
		List<Order> orders=orderRepository.findAllUserOrders(userId);
		return orders;
	} 

	@Override
	public List<Order> getOrdersOfQuarry(Long quarryId, String orderStatus) throws OrderException, QuarryException {
			List<Order> orders = orderRepository.findOrdersByQuarryId(quarryId);
			
			if(orderStatus!=null) {
				orders = orders.stream()
						.filter(order->order.getOrderStatus().equals(orderStatus))
						.collect(Collectors.toList());
			}
			
			return orders;
	}
//    private List<MenuItem> filterByVegetarian(List<MenuItem> menuItems, boolean isVegetarian) {
//    return menuItems.stream()
//            .filter(menuItem -> menuItem.isVegetarian() == isVegetarian)
//            .collect(Collectors.toList());
//}
	
	

	@Override
	public Order updateOrder(Long orderId, String orderStatus) throws OrderException {
		Order order=findOrderById(orderId);
		
		System.out.println("--------- "+orderStatus);
		
		if(orderStatus.equals("OUT_FOR_DELIVERY") || orderStatus.equals("DELIVERED") 
				|| orderStatus.equals("COMPLETED") || orderStatus.equals("PENDING")) {
			order.setOrderStatus(orderStatus);
			Notification notification=notificationService.sendOrderStatusNotification(order);
			return orderRepository.save(order);
		}
		else throw new OrderException("Please Select A Valid Order Status");
		
		
	}
	
	

}
