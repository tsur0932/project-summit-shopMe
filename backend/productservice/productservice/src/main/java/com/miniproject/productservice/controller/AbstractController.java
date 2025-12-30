package com.miniproject.productservice.controller;

import com.miniproject.productservice.utils.ApiException;
import com.miniproject.productservice.utils.ResponseObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;
import java.util.stream.Collectors;

public abstract class AbstractController {

    protected static final String API_V1 = "/api/v1";
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractController.class);

    // Reusable response builders
    protected <T> ResponseEntity<ResponseObject> sendResponse(T response, HttpStatus status) {
        ResponseObject body = new ResponseObject();
        body.setData(response);
        body.setStatus(status);
        return new ResponseEntity<>(body, status);
    }

    protected <T> ResponseEntity<ResponseObject> sendSuccessResponse(T response) {
        return sendResponse(response, HttpStatus.OK);
    }

    protected <T> ResponseEntity<ResponseObject> sendCreatedResponse(T response) {
        return sendResponse(response, HttpStatus.CREATED);
    }

    protected ResponseEntity<Void> sendNoContentResponse() {
        return ResponseEntity.noContent().build();
    }

    @ResponseBody
    @ExceptionHandler(ApiException.class)
    protected ResponseEntity<ResponseObject> handleApiException(ApiException ex) {
        LOGGER.error("Handled ApiException", ex);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", ex.getMessage());
        errorData.put("errors", ex.getErrors());
        errorData.put("timestamp", ex.getTimestamp());

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(ex.getHttpStatus());

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    // Validation error handler
    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ResponseObject> handleValidationException(MethodArgumentNotValidException ex) {
        LOGGER.error("Validation error", ex);

        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", "Validation failed");
        errorData.put("errors", errors);
        errorData.put("timestamp", new Date());

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Optional generic exception fallback
    @ResponseBody
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ResponseObject> handleGenericException(Exception ex) {
        LOGGER.error("Unhandled exception", ex);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", ex.getMessage());
        errorData.put("timestamp", new Date());

        ResponseObject response = new ResponseObject();
        response.setData(errorData);
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
