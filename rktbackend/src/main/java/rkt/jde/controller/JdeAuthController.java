package rkt.jde.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rkt.jde.entity.ErpEnvironment;
import rkt.jde.entity.User;
import rkt.jde.repo.EnvRepository;
import rkt.jde.repo.UserRepository;

@RestController
@RequestMapping("/api/jde")
@CrossOrigin(origins = "http://localhost:3000")
public class JdeAuthController {

    @Autowired
    private EnvRepository envRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder; // ADD THIS

    @PostMapping("/connect")
    public ResponseEntity<?> connectToJde(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password"); // Plain text from React
        String envName = loginData.get("environment");

        ErpEnvironment env = envRepo.findByEnvName(envName)
            .orElseThrow(() -> new RuntimeException("Environment " + envName + " not found."));

        Optional<User> userOpt = userRepo.findByName(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found.");
        }

        User dbUser = userOpt.get();

        // 3. CORRECT WAY TO VERIFY ENCODED PASSWORDS
        if (!passwordEncoder.matches(password, dbUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid Password.");
        }

        // 4. Determine Primary Role (Priority Check)
        String primaryRole = "ROLE_USER"; 
        List<String> roles = dbUser.getRoles();

        if (roles.contains("ROLE_SUPERADMIN")) {
            primaryRole = "ROLE_SUPERADMIN";
        } else if (roles.contains("ROLE_ORG_ADMIN")) { // Added ORG_ADMIN based on your DB logs
            primaryRole = "ROLE_ORG_ADMIN";
        } else if (roles.contains("ROLE_ADMIN")) {
            primaryRole = "ROLE_ADMIN";
        }

        // 5. Build Response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Connected");
        response.put("token", "JWT_" + java.util.UUID.randomUUID().toString());
        response.put("role", primaryRole);
        response.put("fullName", dbUser.getFullName());
        response.put("environment", envName);
        response.put("ais_url", env.getAisBaseUrl());

        return ResponseEntity.ok(response);
    }
}