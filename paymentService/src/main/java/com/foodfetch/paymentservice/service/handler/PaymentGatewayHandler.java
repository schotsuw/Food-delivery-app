package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentGatewayHandler implements PaymentHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentGatewayHandler.class);
    private PaymentHandler nextHandler;

    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    @Override
    public void process(Payment payment) {
        LOGGER.info("Processing payment through gateway: {}", payment.getId());
        // Simulate gateway processing
        // In a real implementation, this would call the actual payment gateway

        // If gateway processing is successful, proceed to next handler
        if (nextHandler != null) {
            nextHandler.process(payment);
        }
    }
}
