package com.example.spring_boot_ecommerce.repository;

import com.example.spring_boot_ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

//@CrossOrigin("http://localhost:4200")
@Repository
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
