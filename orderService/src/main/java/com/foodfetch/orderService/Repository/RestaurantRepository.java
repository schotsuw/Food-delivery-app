package com.foodfetch.orderService.Repository;

import com.foodfetch.orderService.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * RestaurantRepository is an interface that extends MongoRepository to provide CRUD operations for Restaurant.
 * It contains a method to find a restaurant by its name.
 */
@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    Optional<Restaurant> findFirstByName(String name);
}
