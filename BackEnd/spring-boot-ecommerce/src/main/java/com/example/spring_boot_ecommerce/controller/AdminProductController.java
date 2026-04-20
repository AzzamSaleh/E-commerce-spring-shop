package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.entity.Product;
import com.example.spring_boot_ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.example.spring_boot_ecommerce.dto.ProductRequestDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminProductController {

    private final ProductService productService;

    @Autowired
    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    // table by category
    // GET /api/admin/products/by-category?id=1&page=0&size=10
    @GetMapping("/by-category")
    public Page<Product> byCategory(@RequestParam Long id, Pageable pageable) {
        return productService.getProductsByCategoryId(id, pageable);
    }

    // create
    @PostMapping
    public Product create(@Valid @RequestBody ProductRequestDto dto) {
        return productService.create(dto);
    }

    // update
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequestDto dto) {
        return productService.update(id, dto);
    }

    // soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }



}
