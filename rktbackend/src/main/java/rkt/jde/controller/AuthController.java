package rkt.jde.controller;

import java.util.HashMap;
import java.util.Map;

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
        // 1. Initialize the Entity
        User user = new User();
        
        // 2. Map 'username' from JSON/DTO to 'name' in Entity
        // This is the most important line!
        user.setName(request.getUsername()); 
        
        // 3. Encode the password using the Bean in SecurityConfig
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // 4. Map the rest of the fields
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCompany(request.getCompany());
        user.setRoles(request.getRoles()); // List<String> to List<String>
        
        // 5. Save the Entity via Service/Repository
        userService.saveUser(user);
        
        return ResponseEntity.ok("User registered successfully");
    }   
  
   
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) { // Changed String to ?
    	
        System.out.println("DEBUG: Incoming Login Request - Name: [" + request.getName() + "]");

        User user = userService.loadUserByUsername(request.getName());
        
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        
        
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user);
            
           
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRoles().get(0)); 
            response.put("name", user.getName());
            
            return ResponseEntity.ok(response); 
        }
        
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}