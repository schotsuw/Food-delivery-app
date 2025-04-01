package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.service.handler.PaymentProcessor;
import com.foodfetch.paymentservice.service.strategy.PaymentStrategyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/*
 * PaymentGatewayService.java
 * This class handles the payment processing through various payment gateways.
 * It uses the Strategy pattern to select the appropriate payment gateway based on the payment method.
 * It also uses the Chain of Responsibility pattern to process the payment through a series of handlers.
 * It is responsible for orchestrating the payment process and managing the flow of payment data.
 */
@Service
public class PaymentGatewayService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentGatewayService.class);

    // The strategy context for selecting the appropriate payment gateway
    private final PaymentStrategyContext strategyContext;

    /**
     * Constructor for PaymentGatewayService
     *
     * @param strategyContext The strategy context for selecting the appropriate payment gateway
     */
    public PaymentGatewayService(PaymentStrategyContext strategyContext) {
        this.strategyContext = strategyContext;
    }

    /**
     * Processes a payment through the appropriate gateway based on payment method.
     * This method ONLY handles the gateway communication, not the internal processing chain.
     *
     * @param payment The payment to be processed
     * @return true if the payment was processed successfully by the gateway, false otherwise
     */
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing payment through gateway service: {}", payment.getId());

        // Use the strategy pattern to process the payment based on payment method
        return strategyContext.processPayment(payment);
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

        // Use the strategy pattern to process the refund
        return strategyContext.processRefund(refund, originalPayment);
    }
}