package com.foodfetch.trackingservice.state;

import com.foodfetch.trackingservice.model.Delivery;

public class InTransitState implements DeliveryState {

    // In InTransitState class
    @Override
    public void updateStatus(Delivery delivery) {
        delivery.setStatus("IN_TRANSIT");
        // Reduce ETA as delivery progresses
        String currentEta = delivery.getEta();
        int minutes = Integer.parseInt(currentEta.split(" ")[0]);
        // Reduce by more than 5 minutes to ensure it progresses faster
        int newEta = Math.max(1, minutes - 7); // Reduce by 7 minutes instead of 5
        delivery.setEta(newEta + " min");
    }

    @Override
    public DeliveryState next() {
        return new ArrivalState();
    }

    @Override
    public String getStateName() {
        return "IN_TRANSIT";
    }
}