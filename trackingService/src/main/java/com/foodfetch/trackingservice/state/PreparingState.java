package com.foodfetch.trackingservice.state;

import com.foodfetch.trackingservice.model.Delivery;

public class PreparingState implements DeliveryState {

    @Override
    public void updateStatus(Delivery delivery) {
        delivery.setStatus("PREPARING");
        delivery.setEta(estimatePreparationTime() + " min");
    }

    @Override
    public DeliveryState next() {
        return new InTransitState();
    }

    @Override
    public String getStateName() {
        return "PREPARING";
    }

    private String estimatePreparationTime() {
        return "15"; // Simplified estimation
    }
}
