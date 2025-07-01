package com.Lidigu.service;

import com.Lidigu.model.Order;
import com.Lidigu.model.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImplementation implements PaymentService {

	@Value("${stripe.api.key}")
	private String stripeSecretKey;

	@Override
	public PaymentResponse generatePaymentLink(Order order) throws StripeException {
		try {
			System.out.println("Generating payment link for order: " + order.getId());
			System.out.println("Using Stripe API key: " + stripeSecretKey);

			Stripe.apiKey = stripeSecretKey;

			// Create a descriptive product name based on order items
			String productName = "Quarry Order #" + order.getId();
			if (!order.getItems().isEmpty()) {
				productName += " - " + order.getItems().get(0).getMaterial().getName();
				if (order.getItems().size() > 1) {
					productName += " and " + (order.getItems().size() - 1) + " more";
				}
			}

			SessionCreateParams params = SessionCreateParams.builder()
					.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
					.setMode(SessionCreateParams.Mode.PAYMENT)
					.setSuccessUrl("http://localhost:3000/payment/success/" + order.getId())
					.setCancelUrl("http://localhost:3000/payment/fail")
					.setPaymentIntentData(
							SessionCreateParams.PaymentIntentData.builder()
									.putMetadata("orderId", String.valueOf(order.getId()))
									.build()
					)
					.addLineItem(SessionCreateParams.LineItem.builder()
							.setQuantity(1L)
							.setPriceData(SessionCreateParams.LineItem.PriceData.builder()
									.setCurrency("usd")
									.setUnitAmount((long) order.getTotalAmount() * 100) // in cents
									.setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
											.setName(productName)
											.build())
									.build())
							.build())
					.build();

			System.out.println("Creating Stripe session with params: " + params);
			Session session = Session.create(params);
			System.out.println("Stripe session created: " + session.getId());

			PaymentResponse res = new PaymentResponse();
			res.setPayment_url(session.getUrl());

			return res;
		} catch (StripeException e) {
			System.err.println("Stripe error occurred: " + e.getMessage());
			System.err.println("Stripe error code: " + e.getCode());
			System.err.println("Stripe error status code: " + e.getStatusCode());
			throw e;
		} catch (Exception e) {
			System.err.println("Unexpected error in payment processing: " + e.getMessage());
			e.printStackTrace();
			throw new RuntimeException("Unexpected error in payment processing: " + e.getMessage(), e);
		}
	}
}
