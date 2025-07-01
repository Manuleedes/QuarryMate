package com.Lidigu.service;

import java.util.*;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Lidigu.domain.LorryStatus;
import com.Lidigu.model.*;
import com.Lidigu.repository.*;
import com.Lidigu.Exception.*;
import com.Lidigu.request.CreateOrderRequest;


@Service
public class OrderServiceImplementation implements OrderService {

	@Autowired private AddressRepository addressRepository;
	@Autowired private CartSerive cartService;
	@Autowired private OrderItemRepository orderItemRepository;
	@Autowired private OrderRepository orderRepository;
	@Autowired private QuarryRepository quarryRepository;
	@Autowired private UserRepository userRepository;
	@Autowired private PaymentService paymentService;
	@Autowired private MaterialService materialService;
	@Autowired private materialRepository materialRepository;
	@Autowired private NotificationService notificationService;
	@Autowired private LorryRepository lorryRepository;

@Override
public PaymentResponse createOrder(CreateOrderRequest order, User user) throws Exception {

	Address savedAddress = addressRepository.save(order.getDeliveryAddress());
	if (!user.getAddresses().contains(savedAddress)) {
		user.getAddresses().add(savedAddress);
	}
	userRepository.save(user);


	Quarry quarry = quarryRepository.findById(order.getQuarryId())
			.orElseThrow(() -> new QuarryException("Quarry not found with id " + order.getQuarryId()));

	Cart cart = cartService.findCartByUserId(user.getId());


	if (cart.getItems().isEmpty()) {
		throw new Exception("Cart is empty");
	}


	long cartTotal = 0;
	double totalWeight = 0.0;
	List<OrderItem> orderItems = new ArrayList<>();

	for (CartItem cartItem : cart.getItems()) {
		if (cartItem.getTotalPrice() == null || cartItem.getTotalPrice() <= 0) {

			cartItem.setTotalPrice(cartItem.getTotalCost());
		}

		cartTotal += cartItem.getTotalPrice();

		OrderItem orderItem = new OrderItem();
		orderItem.setMaterial(cartItem.getMaterial());
		orderItem.setQuantity((double) cartItem.getQuantity());
		orderItem.setTotalPrice(cartItem.getTotalPrice());

		totalWeight += cartItem.getQuantity();
		orderItems.add(orderItemRepository.save(orderItem));
	}


	Order createdOrder = new Order();
	createdOrder.setCustomer(user);
	createdOrder.setDeliveryAddress(savedAddress);
	createdOrder.setCreatedAt(new Date());
	createdOrder.setOrderStatus("PENDING");
	createdOrder.setQuarry(quarry);
	createdOrder.setTotalWeight(totalWeight);
	createdOrder.setTotalAmount(cartTotal);
	createdOrder.setItems(orderItems);

	Order savedOrder = orderRepository.save(createdOrder);
	quarry.getOrders().add(savedOrder);


	System.out.println("=== Order Amount Details ===");
	System.out.println("Calculated cart total: " + cartTotal);
	System.out.println("Total Weight: " + totalWeight);


	allocateLorriesToOrder(savedOrder, totalWeight);

	System.out.println("Lorry cost: " + savedOrder.getLorryCost());
	System.out.println("Final total with lorry: " + (savedOrder.getTotalAmount() + (savedOrder.getLorryCost() != null ? savedOrder.getLorryCost() : 0)));


	orderRepository.save(savedOrder);
	quarryRepository.save(quarry);

	return paymentService.generatePaymentLink(savedOrder);
}





	@Override
	public void cancelOrder(Long orderId) throws OrderException {
		if (!orderRepository.existsById(orderId)) {
			throw new OrderException("Order not found with the id " + orderId);
		}
		orderRepository.deleteById(orderId);
	}

	public Order findOrderById(Long orderId) throws OrderException {
		return orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderException("Order not found with the id " + orderId));
	}

	@Override
	public List<Order> getUserOrders(Long userId) throws OrderException {
		return orderRepository.findAllUserOrders(userId);
	}

	@Override
	public List<Order> getOrdersOfQuarry(Long quarryId, String orderStatus) throws OrderException, QuarryException {
		List<Order> orders = orderRepository.findOrdersByQuarryId(quarryId);
		if (orderStatus != null) {
			orders = orders.stream()
					.filter(order -> order.getOrderStatus().equals(orderStatus))
					.collect(Collectors.toList());
		}
		return orders;
	}
	@Override
	public void allocateLorriesToOrder(Order order, double totalWeight) throws Exception {
		List<Lorry> availableLorries = lorryRepository.findAvailableLorriesOrderedByCapacityDesc();
		System.out.println("Attempting to allocate lorries for weight: " + totalWeight);

		if (availableLorries.isEmpty()) {
			order.setOrderStatus("PENDING");
			order.setLorryCost(0L);
			System.out.println("No lorries available - Order proceeding without transport allocation");
			return;
		}

		double totalAvailableCapacity = availableLorries.stream()
				.mapToDouble(Lorry::getAllocatedWeight)
				.sum();

		if (totalAvailableCapacity < totalWeight) {
			order.setOrderStatus("PENDING");
			order.setLorryCost(0L);
			System.out.println("Insufficient capacity - Order proceeding without transport allocation");
			return;
		}

		double remainingWeight = totalWeight;
		List<Lorry> allocated = new ArrayList<>();
		long totalLorryCost = 0;
		final long BASE_LORRY_COST = 25000;

		try {
			for (Lorry lorry : availableLorries) {
				if (remainingWeight <= 0) break;

				double assignableWeight = Math.min(remainingWeight, lorry.getAllocatedWeight());
				long lorryCost = calculateLorryCost(assignableWeight, lorry.getAllocatedWeight(), BASE_LORRY_COST);

				// Update lorry details
				lorry.setAllocatedWeight(assignableWeight);
				lorry.setAllocationCost(lorryCost);
				lorry.setOrder(order);  // Link to this order
				lorry.setQuarry(order.getQuarry());
				lorry.setAvailable(false);
				lorry.setStatus(LorryStatus.ASSIGNED); // Mark as assigned

				allocated.add(lorry);
				totalLorryCost += lorryCost;
				remainingWeight -= assignableWeight;
			}

			if (remainingWeight > 0) {
				// Partial allocation not sufficient
				rollbackAllocations(allocated);
				order.setOrderStatus("PENDING");
				order.setLorryCost(0L);
				System.out.println("Partial allocation insufficient - Order proceeding without transport allocation");
				return;
			}

			lorryRepository.saveAll(allocated);
			order.setAllocatedLorries(allocated);
			order.setLorryCost(totalLorryCost);
			order.setTotalAmount(order.getTotalAmount() + totalLorryCost);
			order.setOrderStatus("TRANSPORT_ALLOCATED");
			System.out.println("Successfully allocated lorries. Total lorry cost: " + totalLorryCost);

		} catch (Exception e) {
			rollbackAllocations(allocated);
			order.setOrderStatus("PENDING");
			order.setLorryCost(0L);
			System.out.println("Error during allocation - Rolling back: " + e.getMessage());
		}
	}

	@Override
	@Transactional
	public void confirmPayment(Long orderId) throws Exception {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderException("Order not found with ID: " + orderId));

		if (!(order.getOrderStatus().equalsIgnoreCase("PENDING") ||
				order.getOrderStatus().equalsIgnoreCase("PENDING_TRANSPORT"))) {
			throw new OrderException("Order is not in a payable state (must be PENDING or PENDING_TRANSPORT)");
		}

		for (OrderItem item : order.getItems()) {
			materialService.reduceQuantityAfterPayment(
					item.getMaterial().getId(),
					item.getQuantity()
			);
		}

		order.setOrderStatus("PAID");
		orderRepository.save(order);

		notificationService.sendOrderStatusNotification(order);

		System.out.println("Order payment confirmed and material quantities updated successfully.");
	}



	private void rollbackAllocations(List<Lorry> allocated) {
		allocated.forEach(lorry -> {
			lorry.setAllocatedWeight(0);
			lorry.setAllocationCost(0);
			lorry.setOrder(null);
			lorry.setQuarry(null);
			lorry.setAvailable(true);
			lorry.setStatus(LorryStatus.AVAILABLE);
		});
		if (!allocated.isEmpty()) {
			lorryRepository.saveAll(allocated);
		}
	}



	private long calculateLorryCost(double allocatedWeight, double capacity, long baseCost) {
		double utilizationPercent = (allocatedWeight / capacity) * 100;
		double costMultiplier = 1.0;
		if (utilizationPercent >= 90) {
			costMultiplier = 1.3;
		} else if (utilizationPercent >= 75) {
			costMultiplier = 1.2;
		} else if (utilizationPercent >= 50) {
			costMultiplier = 1.1;
		}
		return (long) (baseCost * costMultiplier);
	}


	@Override
	public Order updateOrder(Long orderId, String orderStatus) throws OrderException {
		Order order = findOrderById(orderId);

		if (List.of("OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "PENDING").contains(orderStatus)) {
			order.setOrderStatus(orderStatus);
			notificationService.sendOrderStatusNotification(order);
			return orderRepository.save(order);
		} else {
			throw new OrderException("Please Select A Valid Order Status");
		}
	}
}
