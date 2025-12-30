package com.miniproject.approvalservice.service;


import com.miniproject.approvalservice.model.ApprovalRequest;
import com.miniproject.approvalservice.model.AuditLog;


import java.util.List;
import java.util.Optional;


public interface ApprovalService {
    List<ApprovalRequest> getPendingApprovals();
    Optional<ApprovalRequest> getApprovalRequestById(Long requestId);
    Optional<ApprovalRequest> getApprovalRequestByProductId(Long productId);
    ApprovalRequest createApprovalRequest(Long productId, String supplierId);
    ApprovalRequest approveProduct(Long productId, String stewardId);
    ApprovalRequest rejectProduct(Long productId, String stewardId, String reason);
    List<AuditLog> getProductAuditLogs(Long productId);
}






