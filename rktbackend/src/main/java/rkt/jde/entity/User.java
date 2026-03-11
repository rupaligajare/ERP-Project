package rkt.jde.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_master") // Maps to a table named user_master in your DB
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @Column(unique = true, nullable = false)
    private String name; // Stores the 'username' from the signup page
    
    @Column(nullable = false)
    private String password;
    
    private String fullName;
    private String email;
    private String phone;
    private String company;

    @ElementCollection(fetch = FetchType.EAGER) // Make sure this is EAGER
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> roles;
}