package rkt.jde.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import rkt.jde.entity.ErpEnvironment;
import rkt.jde.repo.EnvRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/jde")
public class JdeAuthController {

    @Autowired
    private EnvRepository envRepo;

    @PostMapping("/connect")
    public ResponseEntity<?> connectToJde(@RequestBody Map<String, String> loginData) {
        String user = loginData.get("username");
        String pass = loginData.get("password");
        String envName = loginData.get("environment");

        // 1. Internal URL Lookup from DB
        ErpEnvironment env = envRepo.findByEnvName(envName)
            .orElseThrow(() -> new RuntimeException("Environment not found in DB"));

        // 2. Demo Mock Check (For your Demo Testing)
     // Corrected Mock Response for your Demo
        if ("demo_user".equals(user) && "demo_pass123".equals(pass)) {
            Map<String, Object> response = new HashMap<>();
            
            // Use .put() instead of .add()
            response.put("status", "Connected");
            response.put("token", "DEMO_JWT_TOKEN_999");
            response.put("environment", envName);
            response.put("ais_url_used", env.getAisBaseUrl()); 

            return ResponseEntity.ok(response);
        }

        // 3. Real JDE AIS Call (If not using demo credentials)
        String jdeTokenUrl = env.getAisBaseUrl() + "/v2/tokenrequest";
        // Use RestTemplate to POST {username, password, deviceName} to jdeTokenUrl
        
        return ResponseEntity.status(401).body("Invalid JDE Credentials");
    }
}
