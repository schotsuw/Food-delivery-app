package com.foodfetch.orderService.Factory;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * FactoryRegistry is a registry for OrderFactory instances.
 * It allows for the retrieval of specific OrderFactory implementations based on the restaurant name.
 */
@Component
public class FactoryRegistry {
    private final Map<String, OrderFactory> factoryMap = new HashMap<>();

    /**
     * Constructor for FactoryRegistry
     * Initializes the factory map with available OrderFactory implementations.
     */
    public FactoryRegistry() {
        factoryMap.put("McDonald's", new McDonaldsOrderFactory());
        factoryMap.put("Wendy's", new WendysOrderFactory());
    }

    /**
     * Retrieves the OrderFactory for a specific restaurant.
     *
     * @param restaurantName The name of the restaurant
     * @return The corresponding OrderFactory instance
     */
    public OrderFactory getFactory(String restaurantName) {
        return factoryMap.get(restaurantName);
    }
}
