package com.example.spring_boot_ecommerce.service;



import com.example.spring_boot_ecommerce.entity.State;
import com.example.spring_boot_ecommerce.repository.StateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    public List<State> getStatesByCountryCode(String code) {
        return stateRepository.findByCountryCode(code);
    }

    public State getStateById(Integer id) {
        return stateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
    }
}
