package com.Lidigu.service;

import com.stripe.exception.StripeException;
import com.Lidigu.model.Order;
import com.Lidigu.model.PaymentResponse;

public interface PaymentService {
	
	 PaymentResponse generatePaymentLink(Order order) throws StripeException;

}
