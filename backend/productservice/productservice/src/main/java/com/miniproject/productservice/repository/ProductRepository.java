package com.miniproject.productservice.repository;

import com.miniproject.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.status = 'APPROVED'")
    List<Product> findByCategoryIdAndApproved(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) AND p.status = 'APPROVED'")
    List<Product> searchByNameAndApproved(@Param("query") String query);

    List<Product> findByStatus(String status);
}
