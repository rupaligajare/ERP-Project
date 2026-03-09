package rkt.jde.dto;

import java.util.List;

public class UserDto {

    public static class RegisterRequest {
        private String name;
        private String password;
        private List<String> roles;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public List<String> getRoles() { return roles; }
        public void setRoles(List<String> roles) { this.roles = roles; }
    }

    public static class AuthRequest {
        private String name;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}