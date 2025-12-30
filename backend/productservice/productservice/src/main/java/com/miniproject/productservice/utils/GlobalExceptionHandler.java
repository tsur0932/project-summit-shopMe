package com.miniproject.productservice.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ResponseObject> handleApiException(ApiException ex, WebRequest request) {
        LOGGER.error("API Exception", ex);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", ex.getMessage());
        errorData.put("errors", ex.getErrors());
        errorData.put("timestamp", ex.getTimestamp());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(ex.getHttpStatus());

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.toList());

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", "Validation Failed");
        errorData.put("errors", errors);
        errorData.put("timestamp", new Date());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject> handleAllExceptions(Exception ex, WebRequest request) {
        LOGGER.error("Unexpected Exception", ex);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", new Date());
        errorData.put("path", request.getDescription(false).replace("uri=", ""));

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}