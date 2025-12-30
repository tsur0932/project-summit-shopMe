package com.miniproject.productservice.service.impl;

import com.miniproject.productservice.client.ApprovalClient;
import com.miniproject.productservice.model.Category;
import com.miniproject.productservice.model.Product;
import com.miniproject.productservice.repository.CategoryRepository;
import com.miniproject.productservice.repository.ProductRepository;
import com.miniproject.productservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static com.miniproject.productservice.utils.Constants.*;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ApprovalClient approvalClient;

    // Category methods
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Product methods
    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new NoSuchElementException("Category not found with ID: " + categoryId);
        }
        return productRepository.findByCategoryIdAndApproved(categoryId);
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.searchByNameAndApproved(query);
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + productId));
    }

    // Supplier methods
    @Override
    public Product addProduct(Product product) {
        if (product.getName() == null || product.getName().isBlank()) {
            throw new IllegalArgumentException("Product name cannot be null or blank.");
        }
        product.setStatus(PENDING_STATUS);
        Product saved = productRepository.save(product);


        // Non-blocking notify approval-service. Use whatever you use as supplierId (e.g. producerInfo).
        try {
            approvalClient.createApprovalRequest(saved.getProductId(), Map.of(
                    "supplierId", String.valueOf(saved.getProducerInfo()) // or a real supplier id field if you have one
            ));
        } catch (Exception ex) {
            // Log and continue. You can add retries/async later.
            // logger.warn("Failed to create approval request for product {}", saved.getProductId(), ex);
        }


        return saved;
    }


    @Override
    public Product updateProduct(Long productId, Product updatedProduct) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + productId));

        if (updatedProduct.getPrice() != null) product.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getDescription() != null) product.setDescription(updatedProduct.getDescription());
        if (updatedProduct.getProducerInfo() != null) product.setProducerInfo(updatedProduct.getProducerInfo());
        if (updatedProduct.getStockCount() != null) product.setStockCount(updatedProduct.getStockCount());

        return productRepository.save(product);
    }

    @Override
    public boolean deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NoSuchElementException("Cannot delete. Product not found with ID: " + productId);
        }
        productRepository.deleteById(productId);
        return true;
    }

    // Data Steward methods
    @Override
    public List<Product> getPendingProducts() {
        return productRepository.findByStatus(PENDING_STATUS);
    }

    @Override
    public Product approveProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + productId));
        product.setStatus(APPROVED_STATUS);
        return productRepository.save(product);
    }

    @Override
    public Product rejectProduct(Long productId, String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found with ID: " + productId));
        product.setStatus(REJECTED_STATUS);
        return productRepository.save(product);
    }
}
