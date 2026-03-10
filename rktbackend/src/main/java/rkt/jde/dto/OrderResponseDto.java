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
 private String customerName; // Matches order.customerName in React
 private Double amount;
 private String status;

 // Constructor, Getters, Setters
}
