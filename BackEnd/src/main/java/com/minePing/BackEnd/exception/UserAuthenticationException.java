package com.minePing.BackEnd.exception;

public class UserAuthenticationException extends BaseException {
    public UserAuthenticationException() {
        super(ErrorCode.AUTHENTICATION_FAILED);
    }

    public UserAuthenticationException(String message) {
        super(ErrorCode.AUTHENTICATION_FAILED, message);
    }

    public UserAuthenticationException(ErrorCode errorCode, String message) {
        super(ErrorCode.AUTHENTICATION_FAILED, message);
    }

    public UserAuthenticationException(ErrorCode errorCode, String message, Throwable cause) {
        super(ErrorCode.AUTHENTICATION_FAILED, message, cause);
    }
}
