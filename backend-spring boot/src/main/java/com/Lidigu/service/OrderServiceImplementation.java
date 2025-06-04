package com.Lidigu.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.Lidigu.domain.LorryStatus;
import com.Lidigu.model.*;
import com.Lidigu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.Lidigu.Exception.CartException;
import com.Lidigu.Exception.OrderException;
import com.Lidigu.Exception.QuarryException;
import com.Lidigu.Exception.UserException;
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
	private materialRepository materialRepository;
	@Autowired
	private NotificationService notificationService;
	@Autowired
	private LorryRepository lorryRepository;

	
//
//	@Override
//	public PaymentResponse createOrder(CreateOrderRequest order,User user) throws UserException, QuarryException, CartException, StripeException {
//
//	    Address shippAddress = order.getDeliveryAddress();
//
//
//	    Address savedAddress = addressRepository.save(shippAddress);
//
//	    if(!user.getAddresses().contains(savedAddress)) {
//	    	user.getAddresses().add(savedAddress);
//	    }
//
//
//		System.out.println("user addresses --------------  "+user.getAddresses());
//
//		 userRepository.save(user);
//
//
//
//	    Optional<Quarry> quarry = quarryRepository.findById(order.getQuarryId());
//	    if(quarry.isEmpty()) {
//	    	throw new QuarryException("Restaurant not found with id "+order.getQuarryId());
//	    }
//
//	    Order createdOrder = new Order();
//
//	    createdOrder.setCustomer(user);
//	    createdOrder.setDeliveryAddress(savedAddress);
//	    createdOrder.setCreatedAt(new Date());
//	    createdOrder.setOrderStatus("PENDING");
//	    createdOrder.setQuarry(quarry.get());
//
//        Cart cart = cartService.findCartByUserId(user.getId());
//
//	    List<OrderItem> orderItems = new ArrayList<>();
//
//	    for (CartItem cartItem : cart.getItems()) {
//	        OrderItem orderItem = new OrderItem();
//	       orderItem.setMaterial(cartItem.getMaterial());
//	       orderItem.setQuantity(cartItem.getQuantity());
//	        orderItem.setTotalPrice(cartItem.getMaterial().getPricePerTonne()* cartItem.getQuantity());
//
//	        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
//	        orderItems.add(savedOrderItem);
//	    }
//
//	     Long totalPrice = cartService.calculateCartTotals(cart);
//
//	    createdOrder.setTotalAmount(totalPrice);
//	    createdOrder.setQuarry(quarry.get());
//
//	    createdOrder.setItems(orderItems);
//	    Order savedOrder = orderRepository.save(createdOrder);
//
//	   quarry.get().getOrders().add(savedOrder);
//
//	   quarryRepository.save(quarry.get());
//
//
//
//	   PaymentResponse res=paymentSerive.generatePaymentLink(savedOrder);
//	   return res;
//
//	}
	//refactor method
	@Override
	public PaymentResponse createOrder(CreateOrderRequest order, User user) throws Exception {

		Address shippingAddress = order.getDeliveryAddress();
		Address savedAddress = addressRepository.save(shippingAddress);

		if (!user.getAddresses().contains(savedAddress)) {
			user.getAddresses().add(savedAddress);
		}

		userRepository.save(user);

		Optional<Quarry> quarry = quarryRepository.findById(order.getQuarryId());
		if (quarry.isEmpty()) {
			throw new QuarryException("Quarry not found with id " + order.getQuarryId());
		}

		Cart cart = cartService.findCartByUserId(user.getId());

		List<OrderItem> orderItems = new ArrayList<>();
		double totalWeight = 0.0;
		long totalPrice = 0;

		for (CartItem cartItem : cart.getItems()) {
			OrderItem orderItem = new OrderItem();
			orderItem.setMaterial(cartItem.getMaterial());
			orderItem.setQuantity(cartItem.getQuantity());

			double itemWeight = cartItem.getQuantity(); // assume 1 unit = 1 tonne
			double itemPrice = cartItem.getMaterial().getPricePerTonne() * itemWeight;

			orderItem.setTotalPrice((long) itemPrice);
			totalWeight += itemWeight;
			totalPrice += itemPrice;

			OrderItem savedOrderItem = orderItemRepository.save(orderItem);
			orderItems.add(savedOrderItem);
		}

		// Create the order
		Order createdOrder = new Order();
		createdOrder.setCustomer(user);
		createdOrder.setDeliveryAddress(savedAddress);
		createdOrder.setCreatedAt(new Date());
		createdOrder.setOrderStatus("PENDING");
		createdOrder.setQuarry(quarry.get());
		createdOrder.setTotalWeight(totalWeight);
		createdOrder.setTotalAmount(totalPrice);
		createdOrder.setItems(orderItems);

		// Allocate lorries based on total weight
		int lorriesNeeded = (int) Math.ceil(totalWeight / 18.0);
		double remainingWeight = totalWeight;
		List<Lorry> lorries = new ArrayList<>();

		for (int i = 0; i < lorriesNeeded; i++) {
			double weight = Math.min(18.0, remainingWeight);

			Lorry lorry = new Lorry();
			lorry.setAllocatedWeight(weight);
			lorry.setOrder(createdOrder);
			lorries.add(lorry);

			remainingWeight -= weight;
		}
		createdOrder.setAllocatedLorries(lorries);

		// Save order
		Order savedOrder = orderRepository.save(createdOrder);

		// Save order into quarry
		quarry.get().getOrders().add(savedOrder);
		allocateLorriesToOrder(createdOrder, totalWeight);
		quarryRepository.save(quarry.get());

		// Generate payment link
		return paymentSerive.generatePaymentLink(savedOrder);
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

	@Override
	public void allocateLorriesToOrder(Order order, double totalWeight) throws Exception {

		List<Lorry> availableLorries = lorryRepository.findAvailableLorriesOrderedByCapacityDesc();

		if (availableLorries.isEmpty()) {
			throw new Exception("No available lorries to fulfill this order.");
		}

		double remainingWeight = totalWeight;
		List<Lorry> allocated = new ArrayList<>();
		long totalLorryCost = 0;
		final long LORRY_COST = 25000;

		for (Lorry lorry : availableLorries) {
			if (remainingWeight <= 0) break;

			double assignedWeight = Math.min(remainingWeight, lorry.getCapacityInTonnes());

			lorry.setAllocatedWeight(assignedWeight);
			lorry.setAllocationCost(LORRY_COST); // Set cost
			lorry.setOrder(order);
			lorry.setAvailable(false);
			lorry.setStatus(LorryStatus.ASSIGNED);

			allocated.add(lorry);
			totalLorryCost += LORRY_COST;
			remainingWeight -= assignedWeight;
		}

		if (remainingWeight > 0) {
			throw new Exception("Not enough lorry capacity available for this order.");
		}

		order.setAllocatedLorries(allocated);
		order.setLorryCost(totalLorryCost); // Add to order

		// Add to total amount
		long materialCost = order.getTotalAmount(); // previously set
		order.setTotalAmount(materialCost + totalLorryCost);

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
