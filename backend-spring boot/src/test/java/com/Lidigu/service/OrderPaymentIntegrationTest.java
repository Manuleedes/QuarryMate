package com.Lidigu.service;

import com.Lidigu.model.*;
import com.Lidigu.repository.*;
import com.Lidigu.request.CreateOrderRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class OrderPaymentIntegrationTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private QuarryRepository quarryRepository;

    @MockBean
    private AddressRepository addressRepository;

    @MockBean
    private CartSerive cartService;

    @MockBean
    private OrderItemRepository orderItemRepository;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private LorryRepository lorryRepository;

    @MockBean
    private PaymentService paymentService;

    @Test
    public void testCreateOrderGeneratesPaymentLink() throws Exception {
        // Setup test data
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setAddresses(new ArrayList<>());

        Quarry quarry = new Quarry();
        quarry.setId(1L);
        quarry.setOrders(new ArrayList<>());

        Address address = new Address();
        address.setId(1L);
        address.setStreetAddress("123 Test St");
        address.setCity("Test City");
        address.setState("Test State");
        address.setPostalCode("12345");
        address.setCountry("Test Country");
        address.setFullName("Test User");

        Material material = new Material();
        material.setId(1L);
        material.setName("Test Material");
        material.setPricePerUnit(2000L);

        CartItem cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setMaterial(material);
        cartItem.setQuantity(10);
        cartItem.setTotalPrice(20000L);

        Cart cart = new Cart();
        cart.setId(1L);
        cart.setItems(List.of(cartItem));

        OrderItem orderItem = new OrderItem();
        orderItem.setId(1L);
        orderItem.setMaterial(material);
        orderItem.setQuantity(10.0);
        orderItem.setTotalPrice(20000L);

        Order order = new Order();
        order.setId(1L);
        order.setCustomer(user);
        order.setDeliveryAddress(address);
        order.setCreatedAt(new Date());
        order.setOrderStatus("PENDING");
        order.setQuarry(quarry);
        order.setTotalWeight(10.0);
        order.setTotalAmount(20000L);
        order.setItems(List.of(orderItem));

        Lorry lorry = new Lorry();
        lorry.setId(1L);
        lorry.setAllocatedWeight(18L);
        lorry.setNumberPlate("TEST123");
        lorry.setAvailable(true);

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setPayment_url("https://example.com/payment");

        CreateOrderRequest createOrderRequest = new CreateOrderRequest();
        createOrderRequest.setQuarryId(1L);
        createOrderRequest.setTotalPrice(20000L);
        createOrderRequest.setDeliveryAddress(address);

        // Setup mocks
        when(quarryRepository.findById(1L)).thenReturn(Optional.of(quarry));
        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(cartService.findCartByUserId(1L)).thenReturn(cart);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(orderItem);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(lorryRepository.findAvailableLorriesOrderedByCapacityDesc()).thenReturn(List.of(lorry));
        when(paymentService.generatePaymentLink(any(Order.class))).thenReturn(paymentResponse);

        // Execute test
        System.out.println("[DEBUG_LOG] Starting test: testCreateOrderGeneratesPaymentLink");
        PaymentResponse result = orderService.createOrder(createOrderRequest, user);

        // Verify results
        System.out.println("[DEBUG_LOG] Payment URL: " + result.getPayment_url());
        assertNotNull(result, "Payment response should not be null");
        assertEquals("https://example.com/payment", result.getPayment_url(), "Payment URL should match expected value");

        // Verify payment service was called
        Mockito.verify(paymentService).generatePaymentLink(any(Order.class));
        System.out.println("[DEBUG_LOG] Test completed successfully");
    }
}
