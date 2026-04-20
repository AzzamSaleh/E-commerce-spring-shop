package com.example.spring_boot_ecommerce.controller;



import com.example.spring_boot_ecommerce.entity.State;
import com.example.spring_boot_ecommerce.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
@CrossOrigin("http://localhost:4200")
public class StateController {

    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public List<State> getAllStates() {
        return stateService.getAllStates();
    }

    @GetMapping("/{id}")
    public State getStateById(@PathVariable Integer id) {
        return stateService.getStateById(id);
    }

    @GetMapping("/search/findByCountryCode")
    public List<State> getStatesByCountryCode(@RequestParam String code) {
        return stateService.getStatesByCountryCode(code);
    }
}
