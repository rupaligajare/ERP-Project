package rkt.jde.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//DTO: OrderResponseDto.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
 private String orderNumber;
 private String customerOrVendor;
 private Double totalAmount;
 private String status;

 // Constructor, Getters, Setters
}
