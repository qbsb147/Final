package com.minePing.BackEnd.customException;

public class PaymentTransactionException extends RuntimeException {
    public PaymentTransactionException() {
        super("계산 처리 중에 예기치 못한 오류가 발생했습니다.");
    }
    public PaymentTransactionException(String message) {
        super("결제 오류 : " + message);
    }
}
