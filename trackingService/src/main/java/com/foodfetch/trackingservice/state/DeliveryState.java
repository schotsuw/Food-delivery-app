package com.foodfetch.trackingservice.state;

import com.foodfetch.trackingservice.model.Delivery;

public interface DeliveryState {
    void updateStatus(Delivery delivery);
    DeliveryState next();
    String getStateName();
}
