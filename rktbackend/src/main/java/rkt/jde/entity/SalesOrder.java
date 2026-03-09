package rkt.jde.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

//Entity: SalesOrder.java
@Entity
@Data
@Table(name = "demo_sales_orders")
public class SalesOrder {
	
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 
 private String orderNumber; // JDE: DOCO
 private String companyName; // Used for filtering
 private String customerName;
 private Double amount;
 private String status;

 // Getters and Setters
}