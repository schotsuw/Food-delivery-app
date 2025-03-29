// MenuItemRepository.java
package com.foodfetch.orderService.Repository;

import com.foodfetch.orderService.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MenuItemRepository is an interface that extends MongoRepository to provide CRUD operations for MenuItem.
 * It contains a method to find menu items by restaurant ID.
 */
@Repository
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantId(String restaurantId);
}