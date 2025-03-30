// MenuController.java
package com.foodfetch.orderService.controller;

import com.foodfetch.orderService.model.MenuItem;
import com.foodfetch.orderService.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MenuController handles HTTP requests related to menu operations.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuService menuService;

    /**
     * Constructor for MenuController
     *
     * @param menuService Service to handle menu-related operations
     */
    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /**
     * Endpoint to get all menu items
     *
     * @return List of MenuItem
     */
    @GetMapping("/restaurants/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuService.getMenuItemsByRestaurant(restaurantId));
    }

    /**
     * Endpoint to get a specific menu item by its ID
     *
     * @param itemId ID of the menu item
     * @return MenuItem
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable String itemId) {
        return ResponseEntity.ok(menuService.getMenuItemById(itemId));
    }
}