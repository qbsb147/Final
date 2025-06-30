package com.minePing.BackEnd.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import static com.minePing.BackEnd.exception.ConstraintExtractor.extractConstraintName;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    //BaseException및 그 하위예외처리
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex, HttpServletRequest request) {
        log.error("BaseException 발생 : {}", ex.getMessage(), ex);
        ErrorResponse error = ErrorResponse.of(ex.getErrorCode(), request.getRequestURI());
        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(error);
    }

    //404에러처리
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex,
                                                                       HttpServletRequest request) {
        log.error("핸들러를 찾을 수 없음 : {}", ex.getMessage());

        ErrorResponse error = ErrorResponse.of(ErrorCode.RESOURCE_NOT_FOUND, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
                                                               HttpServletRequest request) {
        log.error("잘못된 인수 : {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(ErrorCode.INVALID_USER_INPUT, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex,
                                                                      HttpServletRequest request) {
        log.error("데이터 무결성 위반: {}", ex.getMessage(), ex);
        String message = "이미 사용 중인 값입니다.";

        Throwable cause = ex.getCause();
        if (cause instanceof ConstraintViolationException) {
            String constraintName = extractConstraintName(cause.getMessage());
            System.out.println("sqlMessage = " + constraintName);
            if (constraintName != null && constraintName.contains("business_id")) {
                message = "이미 등록된 사업자 등록번호입니다.";
            } else if (constraintName.contains("email")) {
                message = "이미 사용 중인 이메일입니다.";
            } else if (constraintName.contains("tel")) {
                message = "이미 사용 중인 전화번호입니다.";
            } else if (constraintName.contains("user_id")) {
                message = "이미 사용 중인 아이디입니다.";
            } else if (constraintName.contains("phone")) {
                message = "이미 사용 중인 전화번호입니다.";
            }
/*
            서비스 구현할 때 각각 서비스에 넣을 예외 내용들
            } else if (sqlMessage.contains("uk_company_profile_user_no")) {
                message = "이미 직원 신청한 사용자입니다.";
            } else if (sqlMessage.contains("uk_health_user_no")) {
                message = "이미 등록된 신체 정보가 있습니다.";
            } else if (sqlMessage.contains("uk_member_preference_user_no")) {
                message = "이미 등록된 성향 정보가 있습니다.";
            } else if (sqlMessage.contains("uk_review_application_no")) {
                message = "이미 등록된 리뷰가 있습니다.";
            } else if (sqlMessage.contains("uk_worcation_features_worcation_no")) {
                message = "이미 등록된 워케이션 특성이 있습니다.";
            }
            서비스 구현할 때 각각 서비스에 넣을 예외 내용들
*/

        }

        ErrorResponse error = ErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

}

