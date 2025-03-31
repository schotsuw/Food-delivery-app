package com.foodfetch.trackingservice.state;

public class DeliveryStateFactory {
    public static DeliveryState getState(String status) {
        switch (status) {
            case "PREPARING":
                return new PreparingState();
            case "IN_TRANSIT":
                return new InTransitState();
            case "ARRIVAL":
                return new ArrivalState();
            default:
                return new PreparingState(); // Default state
        }
    }
}
