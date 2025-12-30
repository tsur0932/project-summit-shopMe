package com.miniproject.productservice.utils;


import org.springframework.http.HttpStatus;

import java.util.Date;
import java.util.List;

public class ApiException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final List<String> errors;
    private final Date timestamp;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.httpStatus = status;
        this.errors = null;
        this.timestamp = new Date();
    }

    public ApiException(HttpStatus status, String message, List<String> errors) {
        super(message);
        this.httpStatus = status;
        this.errors = errors;
        this.timestamp = new Date();
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public List<String> getErrors() {
        return errors;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}

