package com.foodfetch.orderService.exception;

public class InvalidOrderStateException extends RuntimeException {
  public InvalidOrderStateException(String message) {
    super(message);
  }
}
