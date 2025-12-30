package com.miniproject.cartservice.model;


public class ProductResponse {
    private Long productResponseId;
    private String name;
    private Float price;
    private String description;
    private String producerInfo;
    private Integer stockCount;
    private String status;


    public Long getProductResponseId() {
        return productResponseId;
    }


    public void setProductResponseId(Long productResponseId) {
        this.productResponseId = productResponseId;
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
}




