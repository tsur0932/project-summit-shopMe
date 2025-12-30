package com.miniproject.approvalservice.repository;


import com.miniproject.approvalservice.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;


public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByProductIdOrderByCreatedAtDesc(Long productId);
}




