package com.miniproject.approvalservice.util;


import org.springframework.http.HttpStatus;


import java.time.Instant;
import java.util.Collections;
import java.util.Map;


public class ApiException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final Map<String, Object> errors;
    private final Instant timestamp;


    public ApiException(String message, HttpStatus status) {
        super(message);
        this.httpStatus = status;
        this.errors = Collections.emptyMap();
        this.timestamp = Instant.now();
    }


    public ApiException(String message, HttpStatus status, Map<String, Object> errors) {
        super(message);
        this.httpStatus = status;
        this.errors = errors == null ? Collections.emptyMap() : errors;
        this.timestamp = Instant.now();
    }


    public HttpStatus getHttpStatus() {
        return httpStatus;
    }


    public Map<String, Object> getErrors() {
        return errors;
    }


    public Instant getTimestamp() {
        return timestamp;
    }
}







