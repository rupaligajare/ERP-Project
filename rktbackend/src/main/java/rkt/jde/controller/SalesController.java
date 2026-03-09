package rkt.jde.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rkt.jde.dto.OrderResponseDto;
import rkt.jde.serviceImpl.SalesServiceImpl;

//Controller: SalesController.java
@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SalesController {
	
 @Autowired
 private SalesServiceImpl salesService;

 @GetMapping("/list")
 @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
 public ResponseEntity<List<OrderResponseDto>> getSales(@RequestParam String company) {
     return ResponseEntity.ok(salesService.getOrdersByCompany(company));
 }
}