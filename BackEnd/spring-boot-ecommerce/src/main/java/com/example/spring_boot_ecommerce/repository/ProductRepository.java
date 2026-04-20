package com.example.spring_boot_ecommerce.repository;

import com.example.spring_boot_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


//@CrossOrigin("http://localhost:4200")
@Repository
public interface ProductRepository extends JpaRepository<Product,Long> //<Entity type, primary key type>
{
    Page<Product> findByCategoryIdAndActiveTrue(Long id, Pageable pageable);

    Page<Product> findByNameContainingAndActiveTrue(String name, Pageable pageable);


    //Spring Data JPA automatically generates the query
    //based on the method name.
    //soft-deleted

    List<Product> findByActiveTrue();

    java.util.Optional<Product> findByIdAndActiveTrue(Long id);

    // For autocomplete suggestions (top 10 matches)
    //List<Product> findTop10ByNameContaining(String keyword);

}
