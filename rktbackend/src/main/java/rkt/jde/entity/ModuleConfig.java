package rkt.jde.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "module_configs")
public class ModuleConfig {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orgId; // Foreign key to Organization
    private String moduleName; // e.g., "SALES", "INVENTORY"
    private boolean enabled;

    // Getters and Setters
}