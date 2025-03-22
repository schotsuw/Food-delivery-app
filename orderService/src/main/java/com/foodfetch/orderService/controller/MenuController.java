// MenuController.java
package com.foodfetch.orderService.controller;

import com.foodfetch.orderService.model.MenuItem;
import com.foodfetch.orderService.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuService menuService;

    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/restaurants/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuService.getMenuItemsByRestaurant(restaurantId));
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable String itemId) {
        return ResponseEntity.ok(menuService.getMenuItemById(itemId));
    }
}