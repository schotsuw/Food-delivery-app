package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentDatabaseHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentDatabaseHandler.class);
    private PaymentHandler nextHandler;
    private final PaymentRepository paymentRepository;

    public PaymentDatabaseHandler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

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
