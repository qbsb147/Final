package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import lombok.*;

/**
 * 워케이션 예약 관련 DTO 모음 클래스
 */
public class ApplicationDto {

    /**
     * 예약 조회 응답 DTO
     * 클라이언트에게 예약 내역(신청 번호, 회원, 워케이션, 기간 등)을 반환할 때 사용
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationResponseDto {

        private Long applicationNo;       // 신청 번호
        private Long userNo;              // 회원 번호
        private String userName;          // 회원 이름 (선택)
        private Long worcationNo;         // 워케이션 번호
        private String worcationName;     // 워케이션 이름 또는 타이틀 (선택)
        private CommonEnums.Approve approve; // 승인 여부 (WAITING, APPROVED 등)
        private LocalDate startDate;      // 예약 시작일
        private LocalDate endDate;        // 예약 종료일
        private String reviewContent;     // 작성된 리뷰가 있는 경우 내용
    }

    /**
     * 예약 신청 요청 DTO
     * 클라이언트가 워케이션을 신청할 때 전달하는 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationRequestDto {

        private Long userNo;              // 예약하는 회원 번호
        private Long worcationNo;         // 예약할 워케이션 번호
        private LocalDate startDate;      // 예약 시작일
        private LocalDate endDate;        // 예약 종료일
    }
}
