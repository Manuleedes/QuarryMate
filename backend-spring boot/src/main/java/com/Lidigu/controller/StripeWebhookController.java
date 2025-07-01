package com.Lidigu.controller;

import com.Lidigu.service.OrderService;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) {
        try {
            String payload = request.getReader().lines().collect(Collectors.joining());
            String sigHeader = request.getHeader("Stripe-Signature");
            String endpointSecret = "your-stripe-webhook-secret";

            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                        .getObject().orElseThrow(() -> new IllegalStateException("Missing PaymentIntent"));

                String orderIdStr = paymentIntent.getMetadata().get("orderId");
                Long orderId = Long.valueOf(orderIdStr);

                orderService.confirmPayment(orderId);

                return ResponseEntity.ok("Payment confirmed and stock updated.");
            }

            return ResponseEntity.ok("Event received.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }
}

