package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * PaymentDatabaseHandler.java
 * This class handles the payment processing by saving the payment information to the database.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 */
@Component
public class PaymentDatabaseHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentDatabaseHandler.class);

    // Next handler in the chain
    private PaymentHandler nextHandler;

    // Repository for database operations
    private final PaymentRepository paymentRepository;

    /**
     * Constructor for PaymentDatabaseHandler
     *
     * @param paymentRepository Repository for payment operations
     */
    public PaymentDatabaseHandler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

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
     * Processes the payment by saving it to the database.
     * If successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be processed
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Saving payment to database: {}", payment.getId());

        // Save payment to database
        paymentRepository.save(payment);

        // If database processing is successful, proceed to next handler
        if (nextHandler != null) {
            nextHandler.process(payment);
        }
    }
}
