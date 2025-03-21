package com.foodfetch.backend.Factory;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class FactoryRegistry {
    private final Map<String, OrderFactory> factoryMap = new HashMap<>();

    public FactoryRegistry() {
        factoryMap.put("McDonald's", new McDonaldsOrderFactory());
        factoryMap.put("Wendy's", new WendysOrderFactory());
    }

    public OrderFactory getFactory(String restaurantName) {
        return factoryMap.get(restaurantName);
    }
}
