package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.dto.ProductSuggestionDto;
import com.example.spring_boot_ecommerce.entity.Product;
import com.example.spring_boot_ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    // GET http://localhost:8080/api/products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET http://localhost:8080/api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }


    // GET /api/products/search/findByCategoryId?id=1&page=0&size=10
    @GetMapping("/search/findByCategoryId")
    public Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable) {
        return productService.getProductsByCategoryId(id, pageable);
    }

    //GET /api/products/search?name=lap&page=0&size=10&sort=unitPrice,desc
    @GetMapping("/search/findByNameContaining")
    public Page<Product> findByNameContaining(@RequestParam String name, Pageable pageable) {
        return productService.searchByName(name, pageable);
    }



    // GET http://localhost:8080/api/products/search/suggest?keyword=lap
//    @GetMapping("/search/suggest")
//    public List<ProductSuggestionDto> suggest(@RequestParam("keyword") String keyword) {
//        return productService.suggestProducts(keyword);
//
//    }
}