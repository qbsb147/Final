package com.minePing.BackEnd.exception;

import org.apache.logging.log4j.message.Message;

public class CompanyNotFoundException extends BaseException {
    public CompanyNotFoundException() {
        super(ErrorCode.COMPANY_NOT_FOUND);
    }

    public CompanyNotFoundException(String message) {
        super(ErrorCode.COMPANY_NOT_FOUND, message);
    }

    public CompanyNotFoundException(String message, Throwable cause) {
        super(ErrorCode.COMPANY_NOT_FOUND, message, cause);
    }
}
