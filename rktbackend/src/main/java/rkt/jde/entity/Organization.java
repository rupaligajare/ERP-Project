package rkt.jde.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "organizations")
@Data 
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "org_name", nullable = false)
    private String orgName; // Maps to "PurePick" or "RKT"

    @Column(name = "jde_ais_url")
    private String jdeAisUrl; // Maps to "http://jde.com"

    @Column(name = "jde_env")
    private String jdeEnv; // Maps to badges like "PY920" or "DV920"

    private String status; // Maps to the "Active" status badge
}
