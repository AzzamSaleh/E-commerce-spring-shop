package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.dto.Checkout;
import com.example.spring_boot_ecommerce.dto.CheckoutResponse;
import com.example.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/checkout")
@CrossOrigin("http://localhost:4200")
public class CheckoutController {

    private CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping
    public CheckoutResponse placeOrder(@RequestBody Checkout checkout) {

        CheckoutResponse checkoutResponse = checkoutService.placeOrder(checkout);

        return checkoutResponse;
    }

}
