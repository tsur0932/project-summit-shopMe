package com.miniproject.approvalservice.model;


import jakarta.persistence.*;


@Entity
@Table(name = "approval_requests")
public class ApprovalRequest extends BaseEntity {


    @Column(name = "product_id", nullable = false)
    private Long productId;


    @Column(name = "supplier_id", nullable = false)
    private String supplierId;


    @Column(name = "steward_id")
    private String stewardId;


    @Column(name = "status", nullable = false)
    private String status; // PENDING, APPROVED, REJECTED


    @Column(name = "reason")
    private String reason; // For rejection


    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }


    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }


    public String getStewardId() { return stewardId; }
    public void setStewardId(String stewardId) { this.stewardId = stewardId; }


    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }


    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}




