package com.example.spring_boot_ecommerce.service;

import com.example.spring_boot_ecommerce.dto.ProductRequestDto;
import com.example.spring_boot_ecommerce.dto.ProductSuggestionDto;
import com.example.spring_boot_ecommerce.entity.Product;
import com.example.spring_boot_ecommerce.entity.ProductCategory;
import com.example.spring_boot_ecommerce.repository.ProductCategoryRepository;
import com.example.spring_boot_ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> getAllProducts() {

        return productRepository.findByActiveTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }


    public Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
    }

    public Page<Product> searchByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingAndActiveTrue(name, pageable);
    }


//    public List<ProductSuggestionDto> suggestProducts(String keyword) {
//        if (keyword == null) keyword = "";
//        String k = keyword.trim();
//        if (k.length() < 2) return List.of(); // avoid heavy queries for 1 letter
//
//        return productRepository
//                .findTop10ByNameContaining(k)
//                .stream()
//                .map(p -> new ProductSuggestionDto(p.getId(), p.getName()))
//                .collect(Collectors.toList());
//    }

    //Admin CRUD methods in service


    public Product create(ProductRequestDto dto) {
        ProductCategory cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product p = new Product();
        p.setName(dto.getName());
        p.setSku(dto.getSku());
        p.setDescription(dto.getDescription());
        p.setUnitPrice(dto.getUnitPrice());
        p.setImageUrl(dto.getImageUrl());
        p.setUnitsInStock(dto.getUnitsInStock());
        p.setCategory(cat);

        p.setActive(true);
        return productRepository.save(p);
    }

    public Product update(Long id, ProductRequestDto dto) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductCategory cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // required fields (always update)
        p.setName(dto.getName());
        p.setUnitPrice(dto.getUnitPrice());
        p.setUnitsInStock(dto.getUnitsInStock());
        p.setCategory(cat);

        // optional fields (update only if provided)
        if (dto.getSku() != null && !dto.getSku().isBlank()) {
            p.setSku(dto.getSku());
        }
        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            p.setDescription(dto.getDescription());
        }
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            p.setImageUrl(dto.getImageUrl());
        }

        return productRepository.save(p);
    }

    public void softDelete(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setActive(false);
        productRepository.save(p);
    }


}
