-- Ensure schema exists (idempotent) and use it in this migration
CREATE SCHEMA IF NOT EXISTS approval;
SET search_path TO approval;


CREATE TABLE IF NOT EXISTS approval_requests (
                                                 id BIGSERIAL PRIMARY KEY,
                                                 created_at TIMESTAMPTZ NOT NULL,
                                                 updated_at TIMESTAMPTZ NOT NULL,
                                                 product_id BIGINT NOT NULL,
                                                 supplier_id VARCHAR(100) NOT NULL,
    steward_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    reason VARCHAR(500)
    );


CREATE INDEX IF NOT EXISTS idx_approval_requests_product_id ON approval_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);


CREATE TABLE IF NOT EXISTS audit_logs (
                                          id BIGSERIAL PRIMARY KEY,
                                          created_at TIMESTAMPTZ NOT NULL,
                                          updated_at TIMESTAMPTZ NOT NULL,
                                          product_id BIGINT NOT NULL,
                                          action VARCHAR(50) NOT NULL,
    actor_id VARCHAR(100) NOT NULL,
    details VARCHAR(1000)
    );


CREATE INDEX IF NOT EXISTS idx_audit_logs_product_id ON audit_logs(product_id);
