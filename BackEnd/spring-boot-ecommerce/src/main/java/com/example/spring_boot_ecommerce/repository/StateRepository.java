package com.example.spring_boot_ecommerce.repository;

import com.example.spring_boot_ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

//@CrossOrigin("http://localhost:4200")
@Repository
public interface StateRepository extends JpaRepository<State, Integer> {

    //To retrieve states for a given country code
    List<State> findByCountryCode(@Param("code") String code);

}
