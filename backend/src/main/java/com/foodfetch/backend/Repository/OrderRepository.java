package com.foodfetch.backend.Repository;

import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByStatusNotIn(Collection<OrderStatus> status);
}
