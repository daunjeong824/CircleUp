package com.ssafy.common.custom;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException() {
        super("");
    }

    public UnAuthorizedException(String message) {
        super(message);
    }
}
