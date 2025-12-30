package com.miniproject.approvalservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;


@FeignClient(name = "product-service", url = "${product-service.base-url}")
public interface ProductClient {


    @GetMapping("/api/v1/products/{productId}")
    Map<String, Object> getProductById(@PathVariable("productId") Long productId);


    @GetMapping("/api/v1/products/steward/pending")
    List<Map<String, Object>> getPendingProducts();


    @PostMapping("/api/v1/products/steward/{productId}/approve")
    Map<String, Object> approveProduct(@PathVariable("productId") Long productId);


    @PostMapping("/api/v1/products/steward/{productId}/reject")
    Map<String, Object> rejectProduct(
            @PathVariable("productId") Long productId,
            @RequestBody Map<String, Object> body // { "reason": "..." } optional
    );
}


