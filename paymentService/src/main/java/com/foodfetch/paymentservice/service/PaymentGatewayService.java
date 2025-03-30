package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.service.handler.PaymentProcessor;
import com.foodfetch.paymentservice.service.strategy.PaymentStrategyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * PaymentGatewayService.java
 * This service is responsible for coordinating payment gateway interactions.
 * It uses both the Strategy pattern and Chain of Responsibility pattern to process payments.
 */
@Service
public class PaymentGatewayService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentGatewayService.class);

    private final PaymentStrategyContext strategyContext;
    private final PaymentProcessor paymentProcessor;

    public PaymentGatewayService(PaymentStrategyContext strategyContext, PaymentProcessor paymentProcessor) {
        this.strategyContext = strategyContext;
        this.paymentProcessor = paymentProcessor;
    }

    /**
     * Processes a payment through the appropriate gateway based on payment method.
     * If the gateway processing is successful, it then processes the payment through
     * the chain of responsibility.
     *
     * @param payment The payment to be processed
     * @return true if the payment was processed successfully, false otherwise
     */
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing payment through gateway service: {}", payment.getId());

        // Use the strategy pattern to process the payment based on payment method
        boolean gatewaySuccess = strategyContext.processPayment(payment);

        if (gatewaySuccess) {
            // Use the chain of responsibility to handle the complete payment workflow
            paymentProcessor.processPayment(payment);
        }

        return gatewaySuccess;
    }

    /**
     * Processes a refund through the appropriate gateway based on payment method.
     *
     * @param refund The refund payment to be processed
     * @param originalPayment The original payment that is being refunded
     * @return true if the refund was processed successfully, false otherwise
     */
    public boolean processRefund(Payment refund, Payment originalPayment) {
        LOGGER.info("Processing refund through gateway service: {}", refund.getId());

        // In a real system, this would integrate with a payment gateway API
        // For this example, we'll use the strategy pattern to process the refund
        return strategyContext.processRefund(refund, originalPayment);
    }
}