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
public class PaymentServiceImplementation implements PaymentService{

	@Value("${stripe.api.key}")
	 private String stripeSecretKey;
	@Override
	public PaymentResponse generatePaymentLink(Order order) throws StripeException {


	  Stripe.apiKey = stripeSecretKey;

	        SessionCreateParams params = SessionCreateParams.builder()
	                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
					.setMode(SessionCreateParams.Mode.PAYMENT)
					.setSuccessUrl("http://localhost:3000/payment/success/"+order.getId())
					//.setSuccessUrl("http://localhost:3000/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}")
					.setCancelUrl("http://localhost:3000/payment/fail")
	                .addLineItem(SessionCreateParams.LineItem.builder()
	                        .setQuantity(1L)
	                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
	                                .setCurrency("usd")
	                                .setUnitAmount((long) order.getTotalAmount()*100) // Specify the order amount in cents
	                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
	                                        .setName("Ballast murram")
	                                        .build())
	                                .build())
	                        .build())
	                .build();
	        
	        Session session = Session.create(params);
			//Session session = Session.retrieve(sessionId);
		System.out.println("session _____ " + session);
	        
	        PaymentResponse res = new PaymentResponse();
	        res.setPayment_url(session.getUrl());
	        
	        return res;
	    
	}
//	Session session = null;
//        try {
//		session = Session.create(params);
//	}catch (StripeException e){
//		System.out.println(e.getMessage());
//	}
//        assert session != null;
//        return StripeResponse.builder()
//				.status("SUCCESS")
//                .message("Payment Session created")
//                .sessionId(session.getId())
//			.sessionUrl(session.getUrl())
//			.build();
//}

}
