package rkt.jde.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import rkt.jde.dto.OrderResponseDto;
import rkt.jde.repo.SalesRepository;
import rkt.jde.service.OrderService;

@Service
public class SalesServiceImpl implements OrderService {
	
    @Autowired
    private SalesRepository salesRepository;

    @Override
    public List<OrderResponseDto> getOrdersByCompany(String companyName) {
        return salesRepository.findByCompanyName(companyName).stream()
            .map(order -> new OrderResponseDto(
                order.getOrderNumber(), 
                order.getCustomerName(), 
                order.getAmount(), 
                order.getStatus()))
            .collect(Collectors.toList());
    }
}