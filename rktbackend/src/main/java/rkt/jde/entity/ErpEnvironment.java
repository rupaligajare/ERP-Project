package rkt.jde.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "erp_environments")
public class ErpEnvironment {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String envName;     // e.g., "DV920"
    private String aisBaseUrl;  // e.g., "https://jde-dv.kt.com/jderest/"
   
}
