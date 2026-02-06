package com.ecommerce.dto;

import javax.validation.constraints.NotBlank;

/**
 * DTO for checkout/order placement requests.
 */
public class CheckoutDto {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String city;

    private String state;

    private String zipCode;

    private String country;

    private String phoneNumber;

    private String paymentMethod = "CREDIT_CARD";

    // For simplicity, we'll simulate card details (not stored)
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;

    // Constructors
    public CheckoutDto() {
    }

    // Getters and Setters
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardExpiry() {
        return cardExpiry;
    }

    public void setCardExpiry(String cardExpiry) {
        this.cardExpiry = cardExpiry;
    }

    public String getCardCvv() {
        return cardCvv;
    }

    public void setCardCvv(String cardCvv) {
        this.cardCvv = cardCvv;
    }

    /**
     * Get full formatted address.
     */
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        sb.append(shippingAddress);
        if (city != null && !city.isEmpty()) {
            sb.append(", ").append(city);
        }
        if (state != null && !state.isEmpty()) {
            sb.append(", ").append(state);
        }
        if (zipCode != null && !zipCode.isEmpty()) {
            sb.append(" ").append(zipCode);
        }
        if (country != null && !country.isEmpty()) {
            sb.append(", ").append(country);
        }
        return sb.toString();
    }
}
