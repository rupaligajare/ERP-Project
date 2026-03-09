package rkt.jde.service;

import java.util.List;

import rkt.jde.dto.OrderResponseDto;

public interface OrderService {
	
    List<OrderResponseDto> getOrdersByCompany(String companyName);
}
