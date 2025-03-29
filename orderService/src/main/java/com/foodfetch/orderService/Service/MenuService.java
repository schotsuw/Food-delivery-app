// MenuService.java
package com.foodfetch.orderService.Service;

import com.foodfetch.orderService.Repository.MenuItemRepository;
import com.foodfetch.orderService.model.MenuItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * MenuService is a service class that provides methods to interact with menu items.
 * It uses MenuItemRepository to perform CRUD operations on menu items.
 */
@Service
public class MenuService {
    private final MenuItemRepository menuItemRepository;

    /**
     * Constructor for MenuService
     *
     * @param menuItemRepository Repository to handle menu item operations
     */
    @Autowired
    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    /**
     * Retrieves all menu items for a specific restaurant.
     *
     * @param restaurantId ID of the restaurant
     * @return List of MenuItem
     */
    public List<MenuItem> getMenuItemsByRestaurant(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    /**
     * Retrieves a specific menu item by its ID.
     *
     * @param id ID of the menu item
     * @return MenuItem
     */
    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }
}