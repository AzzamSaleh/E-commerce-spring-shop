package com.example.spring_boot_ecommerce.repository;

import com.example.spring_boot_ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

//Note: collectionResourceRel:(Name used in JSON responses)
//@Repository
//@CrossOrigin("http://localhost:4200")
//@RepositoryRestResource(collectionResourceRel = "productCategory",path = "product-category")
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
