package com.foodfetch.orderService.Repository;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByStatusNotIn(Collection<OrderStatus> status);
}
