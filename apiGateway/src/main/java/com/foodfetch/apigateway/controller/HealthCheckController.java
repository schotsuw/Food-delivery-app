package com.foodfetch.apigateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthCheckController {

    private final RestTemplate restTemplate;

    @Autowired
    public HealthCheckController(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> result = new HashMap<>();
        result.put("gateway", "UP");

        // Check order service
        result.put("orderService", checkService("http://localhost:8081/actuator/health"));

        // Check payment service
        result.put("paymentService", checkService("http://localhost:8082/actuator/health"));

        return result;
    }

    private String checkService(String url) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return "UP";
            }
        } catch (Exception e) {
            // Service is down or not responding
        }
        return "DOWN";
    }
}