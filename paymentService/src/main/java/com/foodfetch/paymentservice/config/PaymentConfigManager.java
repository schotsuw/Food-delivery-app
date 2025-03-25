package com.foodfetch.paymentservice.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PaymentConfigManager {
    private static PaymentConfigManager instance;
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

    @PostConstruct
    private void init() {
        configParams.put("gatewayUrl", gatewayUrl);
        configParams.put("transactionTimeout", transactionTimeout);
        configParams.put("maxRetries", maxRetries);

        instance = this;
    }

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