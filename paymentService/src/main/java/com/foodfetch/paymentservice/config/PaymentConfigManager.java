package com.foodfetch.paymentservice.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * PaymentConfigManager is a singleton class that manages payment-related configuration parameters.
 * It uses Spring's @Value annotation to inject values from application properties.
 */
@Component
public class PaymentConfigManager {

    // Singleton instance of PaymentConfigManager
    private static PaymentConfigManager instance;

    // Map to hold configuration parameters
    private final Map<String, Object> configParams = new HashMap<>();

    @Getter
    @Value("${payment.gateway.url:https://payment-gateway-api.example.com}")
    private String gatewayUrl;

    @Getter
    @Value("${payment.transaction.timeout:30}")
    private int transactionTimeout;

    @Getter
    @Value("${payment.retry.max:3}")
    private int maxRetries;


    private PaymentConfigManager() {
        // Private constructor to enforce singleton pattern
    }

    /**
     * Initializes the configuration parameters after the bean is constructed.
     * This method is called by Spring after dependency injection is done.
     */
    @PostConstruct
    private void init() {
        configParams.put("gatewayUrl", gatewayUrl);
        configParams.put("transactionTimeout", transactionTimeout);
        configParams.put("maxRetries", maxRetries);

        instance = this;
    }

    /**
     * Returns the singleton instance of PaymentConfigManager.
     *
     * @return Singleton instance of PaymentConfigManager
     */
    public static synchronized PaymentConfigManager getInstance() {
        if (instance == null) {
            instance = new PaymentConfigManager();
        }
        return instance;
    }

    public Object getConfigParam(String key) {
        return configParams.get(key);
    }

}