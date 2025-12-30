package com.miniproject.cartservice.util;

import org.springframework.http.HttpStatus;

public class ResponseObject {
    private Object data;
    private HttpStatus status;

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
