package com.Lidigu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Lidigu.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {


//    CartItem findByFoodIsContaining

}
