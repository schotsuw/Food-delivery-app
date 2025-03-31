package com.foodfetch.trackingservice.state;

import com.foodfetch.trackingservice.model.Delivery;

public class ArrivalState implements DeliveryState {

    @Override
    public void updateStatus(Delivery delivery) {
        delivery.setStatus("DELIVERED");
        delivery.setEta("0 min");
    }

    @Override
    public DeliveryState next() {
        return this; // Terminal state
    }

    @Override
    public String getStateName() {
        return "DELIVERED";
    }
}
