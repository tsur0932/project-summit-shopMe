// product-service/src/main/java/com/miniproject/productservice/client/ApprovalClient.java
package com.miniproject.productservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


import java.util.Map;


@FeignClient(name = "approval-service", url = "${approval-service.base-url:http://localhost:8000}")
public interface ApprovalClient {
    @PostMapping("/api/v1/steward/products/{productId}/request")
    Map<String, Object> createApprovalRequest(
            @PathVariable("productId") Long productId,
            @RequestBody Map<String, Object> body // { "supplierId": "..."}
    );
}


