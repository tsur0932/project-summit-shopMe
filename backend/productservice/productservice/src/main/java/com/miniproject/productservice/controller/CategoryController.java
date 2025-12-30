package com.miniproject.productservice.controller;

import com.miniproject.productservice.model.Category;
import com.miniproject.productservice.model.Product;
import com.miniproject.productservice.service.ProductService;
import com.miniproject.productservice.utils.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AbstractController.API_V1 + "/categories")
public class CategoryController extends AbstractController {

    private final ProductService productService;

    @Autowired
    public CategoryController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCategories() {
        List<Category> categories = productService.getAllCategories();
        return sendSuccessResponse(categories);
    }

    @GetMapping("/{categoryId}/products")
    public ResponseEntity<ResponseObject> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        return sendSuccessResponse(products);
    }
}
