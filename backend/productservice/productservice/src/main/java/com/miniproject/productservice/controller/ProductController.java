package com.miniproject.productservice.controller;

import com.miniproject.productservice.model.Product;
import com.miniproject.productservice.service.ProductService;
import com.miniproject.productservice.utils.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(AbstractController.API_V1 + "/products")
public class ProductController extends AbstractController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllProducts() {
        List <Product> products = productService.getAllProducts();
        return sendSuccessResponse(products);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseObject> searchProducts(@RequestParam String productName) {
        List<Product> products = productService.searchProducts(productName);
        return sendSuccessResponse(products);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ResponseObject> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return sendSuccessResponse(product);
    }

    @PostMapping("/supplier")
    public ResponseEntity<ResponseObject> addSupplierProduct(@RequestBody Product product) {
        Product savedProduct = productService.addProduct(product);
        return sendCreatedResponse(savedProduct);
    }

    @PutMapping("/supplier/{productId}")
    public ResponseEntity<ResponseObject> updateSupplierProduct(@PathVariable Long productId, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(productId, product);
        return sendSuccessResponse(updatedProduct);
    }

    @DeleteMapping("/supplier/{productId}")
    public ResponseEntity<?> deleteSupplierProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return sendNoContentResponse();
    }

    @GetMapping("/steward/pending")
    public ResponseEntity<ResponseObject> getPendingProducts(@RequestParam String status) {
        List<Product> pendingProducts = productService.getPendingProducts();
        return sendSuccessResponse(pendingProducts);
    }

    @PostMapping("/steward/{productId}/approve")
    public ResponseEntity<ResponseObject> approveProduct(@PathVariable Long productId) {
        Product approvedProduct = productService.approveProduct(productId);
        return sendSuccessResponse(approvedProduct);
    }

    @PostMapping("/steward/{productId}/reject")
    public ResponseEntity<ResponseObject> rejectProduct(@PathVariable Long productId, @RequestBody(required = false) RejectRequest request) {
        String reason = request != null ? request.getReason() : null;
        Product rejectedProduct = productService.rejectProduct(productId, reason);
        return sendSuccessResponse(rejectedProduct);
    }

    public static class RejectRequest {
        private String reason;
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}

