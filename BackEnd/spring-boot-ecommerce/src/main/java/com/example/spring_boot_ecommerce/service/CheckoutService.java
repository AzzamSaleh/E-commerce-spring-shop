package com.example.spring_boot_ecommerce.service;

import com.example.spring_boot_ecommerce.dto.Checkout;
import com.example.spring_boot_ecommerce.dto.CheckoutResponse;
import com.example.spring_boot_ecommerce.entity.Customer;
import com.example.spring_boot_ecommerce.entity.Order;
import com.example.spring_boot_ecommerce.entity.OrderItem;
import com.example.spring_boot_ecommerce.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
@Service
public class CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }


    @Transactional
    public CheckoutResponse placeOrder(Checkout checkout) {

        // retrieve the order info from dto
        Order order = checkout.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = checkout.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(checkout.getBillingAddress());
        order.setShippingAddress(checkout.getShippingAddress());

        // populate customer with order
        Customer customer = checkout.getCustomer();
        customer.add(order);

        // save to the database
        customerRepository.save(customer);

        // return a response
        return new CheckoutResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate a random UUID number (UUID version-4)
        // For details see: https://en.wikipedia.org/wiki/Universally_unique_identifier
        //
        return UUID.randomUUID().toString();
    }
}
