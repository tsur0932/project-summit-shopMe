package com.miniproject.approvalservice.controller;

import com.miniproject.approvalservice.model.ApprovalRequest;
import com.miniproject.approvalservice.model.AuditLog;
import com.miniproject.approvalservice.service.ApprovalService;
import com.miniproject.approvalservice.util.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(ApprovalController.BASE_PATH)
public class ApprovalController extends AbstractController {


    public static final String BASE_PATH = API_V1 + "/steward";


    private final ApprovalService approvalService;


    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }


    @GetMapping("/products/pending")
    public ResponseEntity<ResponseObject> getPendingApprovals() {
        List<ApprovalRequest> pendingRequests = approvalService.getPendingApprovals();
        return sendSuccessResponse(pendingRequests);
    }


    @GetMapping("/requests/{requestId}")
    public ResponseEntity<ResponseObject> getApprovalRequestById(@PathVariable Long requestId) {
        Optional<ApprovalRequest> request = approvalService.getApprovalRequestById(requestId);
        return request.map(this::sendSuccessResponse).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    @GetMapping("/products/{productId}/request")
    public ResponseEntity<ResponseObject> getApprovalRequestByProductId(@PathVariable Long productId) {
        Optional<ApprovalRequest> request = approvalService.getApprovalRequestByProductId(productId);
        return request.map(this::sendSuccessResponse).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


    @PostMapping("/products/{productId}/request")
    public ResponseEntity<ResponseObject> createApprovalRequest(@PathVariable Long productId, @RequestBody CreateRequestBody body) {
        ApprovalRequest request = approvalService.createApprovalRequest(productId, body.getSupplierId());
        return sendCreatedResponse(request);
    }


    @PostMapping("/products/{productId}/approve")
    public ResponseEntity<ResponseObject> approveProduct(@PathVariable Long productId, @RequestBody ApproveRejectBody body) {
        ApprovalRequest request = approvalService.approveProduct(productId, body.getStewardId());
        return sendSuccessResponse(request);
    }


    @PostMapping("/products/{productId}/reject")
    public ResponseEntity<ResponseObject> rejectProduct(@PathVariable Long productId, @RequestBody RejectBody body) {
        ApprovalRequest request = approvalService.rejectProduct(productId, body.getStewardId(), body.getReason());
        return sendSuccessResponse(request);
    }


    @GetMapping("/products/{productId}/audit")
    public ResponseEntity<ResponseObject> getProductAuditLogs(@PathVariable Long productId) {
        List<AuditLog> logs = approvalService.getProductAuditLogs(productId);
        return sendSuccessResponse(logs);
    }


    // Request body classes
    public static class CreateRequestBody {
        private String supplierId;
        public String getSupplierId() { return supplierId; }
        public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    }


    public static class ApproveRejectBody {
        private String stewardId;
        public String getStewardId() { return stewardId; }
        public void setStewardId(String stewardId) { this.stewardId = stewardId; }
    }


    public static class RejectBody extends ApproveRejectBody {
        private String reason;
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}







