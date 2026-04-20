package com.example.spring_boot_ecommerce.controller;



import com.example.spring_boot_ecommerce.entity.Country;
import com.example.spring_boot_ecommerce.entity.State;
import com.example.spring_boot_ecommerce.service.CountryService;
import com.example.spring_boot_ecommerce.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin("http://localhost:4200")
public class CountryController {

    private final CountryService countryService;
    private final StateService stateService;

    @Autowired
    public CountryController(CountryService countryService, StateService stateService) {
        this.countryService = countryService;
        this.stateService = stateService;
    }

    @GetMapping
    public List<Country> getAllCountries() {
        return countryService.getAllCountries();
    }

    @GetMapping("/{id}")
    public Country getCountryById(@PathVariable Integer id) {
        return countryService.getCountryById(id);
    }

//    @GetMapping("/{code}/states")
//    public List<State> getStatesByCountryCode(@PathVariable String code) {
//        return stateService.getStatesByCountryCode(code);
//    }
}
