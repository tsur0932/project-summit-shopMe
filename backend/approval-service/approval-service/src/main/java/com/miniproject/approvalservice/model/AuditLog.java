package com.miniproject.approvalservice.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity {


    @Column(name = "product_id", nullable = false)
    private Long productId;


    @Column(name = "action", nullable = false)
    private String action; // REQUEST_CREATED, APPROVED, REJECTED


    @Column(name = "actor_id", nullable = false)
    private String actorId; // supplierId or stewardId


    @Column(name = "details")
    private String details;


    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }


    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }


    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }


    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}




