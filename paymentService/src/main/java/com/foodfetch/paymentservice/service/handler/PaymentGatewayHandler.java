package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/*
 * PaymentGatewayHandler.java
 * This class handles the payment processing through a payment gateway.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 */
@Component
public class PaymentGatewayHandler implements PaymentHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentGatewayHandler.class);

    // Next handler in the chain
    private PaymentHandler nextHandler;

    /**
     * Sets the next handler in the chain.
     *
     * @param handler The next PaymentHandler
     */
    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    /**
     * Processes the payment through the payment gateway.
     * If successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be processed
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Processing payment through gateway: {}", payment.getId());
        // Simulate gateway processing **make it simple for demo purposes**
        // In a real implementation, this would call the actual payment gateway

        // If gateway processing is successful, proceed to next handler
        if (nextHandler != null) {
            nextHandler.process(payment);
        }
    }
}
