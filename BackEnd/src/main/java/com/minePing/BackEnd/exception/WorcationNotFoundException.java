package com.minePing.BackEnd.exception;

public class WorcationNotFoundException extends BaseException {
    public WorcationNotFoundException() {
        super(ErrorCode.RESOURCE_NOT_FOUND);
    }

    public WorcationNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }

    public WorcationNotFoundException(ErrorCode errorCode, String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }

    public WorcationNotFoundException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message, cause);
    }
}