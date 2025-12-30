package com.miniproject.productservice.utils;

import org.springframework.http.HttpStatus;

public class ResponseObject {
    private Object data;
    private HttpStatus status;

    public ResponseObject() {}

    public ResponseObject(Object data, HttpStatus status) {
        this.data = data;
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }
}
