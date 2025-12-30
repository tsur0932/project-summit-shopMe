package com.miniproject.cartservice.repository;

import com.miniproject.cartservice.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCart_CartIdAndProductId(Long cartId, Long productId);
}
