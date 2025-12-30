package com.miniproject.productservice.service;


import com.miniproject.productservice.model.Category;
import com.miniproject.productservice.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    // Category methods
    List<Category> getAllCategories();

    // Product methods
    List<Product> getProductsByCategory(Long categoryId);

    List<Product> getAllProducts();

    List<Product> searchProducts(String query);

    Product getProductById(Long productId);

    // Supplier methods
    Product addProduct(Product product);

    Product updateProduct(Long productId, Product updatedProduct);

    boolean deleteProduct(Long productId);

    // Data Steward methods
    List<Product> getPendingProducts();

    Product approveProduct(Long productId);

    Product rejectProduct(Long productId, String reason);
}
