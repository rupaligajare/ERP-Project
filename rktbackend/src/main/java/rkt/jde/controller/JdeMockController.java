package rkt.jde.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rkt.jde.repo.EnvRepository;
import rkt.jde.entity.ErpEnvironment;

@RestController
@RequestMapping("/api/jde")
@CrossOrigin(origins = "http://localhost:3000")
public class JdeMockController {

    @Autowired
    private EnvRepository envRepository;

    @GetMapping("/available-services")
    public ResponseEntity<?> getMockServices(
            @RequestParam String role, 
            @RequestParam String env) {
        
        // 1. Fetch URL from DB based on environment, with a static fallback for the demo
        String baseUrl = envRepository.findByEnvName(env)
                .map(ErpEnvironment::getAisBaseUrl)
                .orElse("https://jde-demo.kt-oracle.com/jderest/");

        List<Map<String, String>> services = new ArrayList<>();

        // 2. Logic based on role: This simulates the "Authorization" part of the login
        if ("ADMIN".equals(role) || "*ALL".equals(role)) {
            services.add(createService("Inventory", "Manage real-time stock", "P41202", baseUrl));
            services.add(createService("Sales Orders", "Process customer orders", "P4210", baseUrl));
            services.add(createService("Finance", "General Ledger Review", "P0911", baseUrl));
            services.add(createService("Procurement", "Purchase Order Entry", "P4310", baseUrl));
        } else {
            services.add(createService("Inventory", "Check current stock", "P41202", baseUrl));
        }

        return ResponseEntity.ok(services);
    }

    // Fixed signature to handle description and base URL
    private Map<String, String> createService(String title, String desc, String appId, String baseUrl) {
        Map<String, String> service = new HashMap<>();
        service.put("title", title);
        service.put("description", desc);
        service.put("appId", appId);
        // We provide the link but don't actually ping it during this demo
        service.put("targetUrl", baseUrl + "v2/orchestrator/" + appId);
        return service;
    }
}