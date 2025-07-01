package com.minePing.BackEnd.exception;

public class DuplicateResourceException extends BaseException {
    public DuplicateResourceException() {
        super(ErrorCode.DUPLICATE_RESOURCE);
    }

    public DuplicateResourceException(String message) {
        super(ErrorCode.DUPLICATE_RESOURCE, message);
    }

    public DuplicateResourceException(String message, Throwable cause) {
        super(ErrorCode.DUPLICATE_RESOURCE, message, cause);
    }
}
