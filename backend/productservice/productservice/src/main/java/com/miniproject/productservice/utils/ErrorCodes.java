package com.miniproject.productservice.utils;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCodes {

    SERVICE_FAILURE("10000", HttpStatus.INTERNAL_SERVER_ERROR),
    TYPE_INVALID("10001", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("10002", HttpStatus.NOT_FOUND),
    FORBIDDEN("10003", HttpStatus.FORBIDDEN),
    CONFLICT("10004", HttpStatus.CONFLICT);

    private String code;
    private HttpStatus status;

    ErrorCodes(String code, HttpStatus status) {
        this.code =  code;
        this.status = status;
    }
}
