package com.Lidigu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
