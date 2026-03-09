package rkt.jde.serviceImpl;

import java.util.Collections;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rkt.jde.dto.UserDto;
import rkt.jde.entity.User;
import rkt.jde.repo.UserRepository;
import rkt.jde.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User loadUserByUsername(String username) {
        return userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }
    
    @Override
    public String registerUser(UserDto.RegisterRequest regReq) {
        // 1. Check if username (mapped to name) exists
        if (userRepository.existsByName(regReq.getUsername())) {
            return "Error: Username already exists!";
        }
        
        // 2. Map all 7 fields from DTO to Entity
        User user = new User();
        user.setName(regReq.getUsername()); // Login ID
        user.setPassword(passwordEncoder.encode(regReq.getPassword()));
        user.setFullName(regReq.getFullName());
        user.setEmail(regReq.getEmail());
        user.setPhone(regReq.getPhone());
        user.setCompany(regReq.getCompany());
        
        // Handle roles: if DTO roles are empty, set default
        if (regReq.getRoles() != null && !regReq.getRoles().isEmpty()) {
            user.setRoles(regReq.getRoles());
        } else {
            user.setRoles(Collections.singletonList("ROLE_USER"));
        }
        
        userRepository.save(user);
        return "User registered successfully";
    }
}