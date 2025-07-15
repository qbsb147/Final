package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.swing.text.html.parser.Entity;
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
        private Worcation worcation; // 워케이션 엔티티 전체
        private Member member; //회원 데이터 전체
        private WorcationDto.Response worcationDto;


        /**
         * Entity → DTO 변환 메서드
         * Mapper 없이 수동 변환
         */
        public static ApplicationResponseDto fromEntity(WorcationApplication entity) {
            return ApplicationResponseDto.builder()
                    .applicationNo(entity.getApplicationNo())
                    .userNo(entity.getMember().getUserNo())
                    .userName(entity.getMember().getName())
                    .worcationNo(entity.getWorcation().getWorcationNo())
                    .worcationName(entity.getWorcation().getWorcationName())
                    .approve(entity.getApprove())
                    .startDate(entity.getStartDate())
                    .endDate(entity.getEndDate())
                    .reviewContent(entity.getReview() != null ? entity.getReview().getReviewContent() : null)
                    .build();
        }
    }

    public static ApplicationResponseDto fromEntity(WorcationApplication app, Worcation enrichedWorcation) {
        return ApplicationResponseDto.builder()
                .applicationNo(app.getApplicationNo())
                .startDate(app.getStartDate())
                .endDate(app.getEndDate())
                .approve(app.getApprove())
                .worcation(enrichedWorcation)
                .member(app.getMember())
                .build();
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


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReservedResponseDto {
        private LocalDate startDate;
        private LocalDate endDate;

        public static ReservedResponseDto fromEntity(WorcationApplication entity) {
            return ReservedResponseDto.builder()
                    .startDate(entity.getStartDate())
                    .endDate(entity.getEndDate())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RemainingDto {
        private LocalDate date;
        private int remaining;
        private int maxPeople; // 추가
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResponseDto {
        private LocalDate startDate;
        private LocalDate endDate;

        // 날짜 범위 계산 메서드
        public List<LocalDate> getDateRange() {
            List<LocalDate> dates = new ArrayList<>();
            LocalDate current = startDate;
            while (!current.isAfter(endDate)) {
                dates.add(current);
                current = current.plusDays(1);
            }
            return dates;
        }
    }
}
