package com.foodfetch.orderService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/test"  // <-- Valid dummy URI
})
public class OrderServiceApplicationTest {

    @Test
    void contextLoads() {
    }
}
