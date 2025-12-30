package com.miniproject.approvalservice.repository;


import com.miniproject.approvalservice.model.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByStatus(String status);
    Optional<ApprovalRequest> findByProductId(Long productId);
}





