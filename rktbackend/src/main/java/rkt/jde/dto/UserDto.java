package rkt.jde.dto;

import java.util.List;
import lombok.Data;

public class UserDto {

    @Data
    public static class RegisterRequest {
        private String fullName;
        private String username; 
        private String email;
        private String phone;
        private String company;
        private String password;
        private List<String> roles;
    }
   

    @Data
    public static class AuthRequest {
        private String name; // This is used for login
        private String password;
    }
}