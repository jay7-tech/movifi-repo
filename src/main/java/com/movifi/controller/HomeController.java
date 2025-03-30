package com.movifi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Movifi API");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "GET /api/movies", "Get all movies",
            "GET /api/movies/{id}", "Get a specific movie by ID",
            "POST /api/movies", "Create a new movie",
            "PUT /api/movies/{id}", "Update an existing movie",
            "DELETE /api/movies/{id}", "Delete a movie"
        ));
        return response;
    }
} 