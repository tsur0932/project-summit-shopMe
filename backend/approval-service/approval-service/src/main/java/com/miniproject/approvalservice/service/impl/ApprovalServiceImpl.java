package com.miniproject.approvalservice.service.impl;


import com.miniproject.approvalservice.client.ProductClient;
import com.miniproject.approvalservice.model.ApprovalRequest;
import com.miniproject.approvalservice.model.AuditLog;
import com.miniproject.approvalservice.repository.ApprovalRequestRepository;
import com.miniproject.approvalservice.repository.AuditLogRepository;
import com.miniproject.approvalservice.service.ApprovalService;
import com.miniproject.approvalservice.util.ApiException;
import com.miniproject.approvalservice.util.Constants;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class ApprovalServiceImpl implements ApprovalService {


    private final ApprovalRequestRepository approvalRequestRepository;
    private final AuditLogRepository auditLogRepository;
    private final ProductClient productClient;


    public ApprovalServiceImpl(ApprovalRequestRepository approvalRequestRepository,
                               AuditLogRepository auditLogRepository,
                               ProductClient productClient) {
        this.approvalRequestRepository = approvalRequestRepository;
        this.auditLogRepository = auditLogRepository;
        this.productClient = productClient;
    }


    @Override
    public List<ApprovalRequest> getPendingApprovals() {
        return approvalRequestRepository.findByStatus(Constants.STATUS_PENDING);
    }


    @Override
    public Optional<ApprovalRequest> getApprovalRequestById(Long requestId) {
        return approvalRequestRepository.findById(requestId);
    }


    @Override
    public Optional<ApprovalRequest> getApprovalRequestByProductId(Long productId) {
        return approvalRequestRepository.findByProductId(productId);
    }


    @Override
    @Transactional
    public ApprovalRequest createApprovalRequest(Long productId, String supplierId) {
        // Ensure product exists and is currently PENDING in product-service
        Map<String, Object> product = fetchProduct(productId);
        String status = extractStatus(product);
        if (!Constants.STATUS_PENDING.equalsIgnoreCase(status)) {
            throw new ApiException("Product is not in PENDING status", HttpStatus.BAD_REQUEST);
        }


        // Ensure there isn't already a pending request
        Optional<ApprovalRequest> existing = approvalRequestRepository.findByProductId(productId);
        if (existing.isPresent() && Constants.STATUS_PENDING.equalsIgnoreCase(existing.get().getStatus())) {
            return existing.get(); // idempotent
        }


        ApprovalRequest request = new ApprovalRequest();
        request.setProductId(productId);
        request.setSupplierId(supplierId);
        request.setStatus(Constants.STATUS_PENDING);
        request = approvalRequestRepository.save(request);


        createAudit(productId, "REQUEST_CREATED", supplierId, "Supplier created approval request");
        return request;
    }


    @Override
    @Transactional
    public ApprovalRequest approveProduct(Long productId, String stewardId) {
        ApprovalRequest request = approvalRequestRepository.findByProductId(productId)
                .orElseThrow(() -> new ApiException("Approval request not found for product", HttpStatus.NOT_FOUND));


        if (Constants.STATUS_APPROVED.equalsIgnoreCase(request.getStatus())) {
            return request; // idempotent
        }
        if (!Constants.STATUS_PENDING.equalsIgnoreCase(request.getStatus())) {
            throw new ApiException("Only PENDING requests can be approved", HttpStatus.BAD_REQUEST);
        }


        request.setStatus(Constants.STATUS_APPROVED);
        request.setStewardId(stewardId);
        request.setReason(null);
        request = approvalRequestRepository.save(request);


        // Update product status via product-service steward endpoint
        productClient.approveProduct(productId);


        createAudit(productId, "APPROVED", stewardId, "Product approved by steward");
        return request;
    }


    @Override
    @Transactional
    public ApprovalRequest rejectProduct(Long productId, String stewardId, String reason) {
        ApprovalRequest request = approvalRequestRepository.findByProductId(productId)
                .orElseThrow(() -> new ApiException("Approval request not found for product", HttpStatus.NOT_FOUND));


        if (Constants.STATUS_REJECTED.equalsIgnoreCase(request.getStatus())) {
            return request; // idempotent
        }
        if (!Constants.STATUS_PENDING.equalsIgnoreCase(request.getStatus())) {
            throw new ApiException("Only PENDING requests can be rejected", HttpStatus.BAD_REQUEST);
        }


        request.setStatus(Constants.STATUS_REJECTED);
        request.setStewardId(stewardId);
        request.setReason(reason);
        request = approvalRequestRepository.save(request);


        // Update product status via product-service steward endpoint
        Map<String, Object> body = new HashMap<>();
        body.put("reason", reason);
        productClient.rejectProduct(productId, body);


        createAudit(productId, "REJECTED", stewardId, "Product rejected: " + (reason == null ? "No reason" : reason));
        return request;
    }


    @Override
    public List<AuditLog> getProductAuditLogs(Long productId) {
        return auditLogRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }


    private Map<String, Object> fetchProduct(Long productId) {
        try {
            return productClient.getProductById(productId);
        } catch (FeignException.NotFound e) {
            throw new ApiException("Product not found", HttpStatus.NOT_FOUND);
        } catch (FeignException e) {
            throw new ApiException("Failed to contact product-service", HttpStatus.BAD_GATEWAY);
        }
    }


    @SuppressWarnings("unchecked")
    private String extractStatus(Map<String, Object> response) {
        if (response == null) return null;
        Object data = response.get("data");
        if (data instanceof Map<?, ?> dataMap) {
            Object status = ((Map<String, Object>) dataMap).get("status");
            return status == null ? null : status.toString();
        }
        // If product-service returns raw product instead of wrapped
        Object status = response.get("status");
        return status == null ? null : status.toString();
    }


    private void createAudit(Long productId, String action, String actorId, String details) {
        AuditLog log = new AuditLog();
        log.setProductId(productId);
        log.setAction(action);
        log.setActorId(actorId);
        log.setDetails(details);
        auditLogRepository.save(log);
    }
}




