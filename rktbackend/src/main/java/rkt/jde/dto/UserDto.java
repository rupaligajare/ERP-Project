package rkt.jde.dto;

import java.util.List;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String fullName;
        
        @Column(unique = true, nullable = false)
        private String name;
        private String username; 
        private String email;
        private String phone;
        private String company;
        private String password;
        private List<String> roles;
    }
   

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthRequest {
        private String name; // This is used for login
        private String password;
    }
}