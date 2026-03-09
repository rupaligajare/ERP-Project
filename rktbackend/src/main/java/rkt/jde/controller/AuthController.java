package rkt.jde.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import rkt.jde.dto.UserDto.AuthRequest;
import rkt.jde.dto.UserDto.RegisterRequest;
import rkt.jde.entity.User;
import rkt.jde.service.UserService;
import rkt.jde.util.JwtUtil;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            
            // 1. Mapping 'username' from React/DTO to 'name' in Entity for Security
            user.setName(request.getUsername()); 
            
            // 2. Encoding password for security before it hits the DB
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // 3. Mapping the extra 5 fields from your multi-field signup
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());
            user.setEmail(request.getEmail());
            user.setCompany(request.getCompany());
            user.setRoles(request.getRoles());
            
            // 4. Passing to service (where the duplicate check happens)
            userService.saveUser(user);
            
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            // Catches "Username already taken" from UserService
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        // Authenticating via the 'name' field (which stores the username)
        User user = userService.loadUserByUsername(request.getName());
        
        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}