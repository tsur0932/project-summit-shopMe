package com.miniproject.productservice.model;

import jakarta.persistence.*;
import static com.miniproject.productservice.utils.Constants.PENDING_STATUS;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @Column(name = "product_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Float price;

    private String description;

    @Column(name = "producer_info")
    private String producerInfo;

    @Column(name = "stock_count", nullable = false)
    private Integer stockCount;

    @Column(nullable = false)
    private String status = PENDING_STATUS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private boolean approved;

    // Constructors
    public Product() {}

    public Product(String name, Float price, String description, String producerInfo, Integer stockCount, Category category) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.producerInfo = producerInfo;
        this.stockCount = stockCount;
        this.category = category;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProducerInfo() {
        return producerInfo;
    }

    public void setProducerInfo(String producerInfo) {
        this.producerInfo = producerInfo;
    }

    public Integer getStockCount() {
        return stockCount;
    }

    public void setStockCount(Integer stockCount) {
        this.stockCount = stockCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
