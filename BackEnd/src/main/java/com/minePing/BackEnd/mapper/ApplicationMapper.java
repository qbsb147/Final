package com.minePing.BackEnd.mapper;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.dto.ApplicationDto.ApplicationRequestDto;
import com.minePing.BackEnd.dto.ApplicationDto.ApplicationResponseDto;
import com.minePing.BackEnd.entity.WorcationApplication;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {

    /**
     * WorcationApplication 엔티티 → 예약 조회용 DTO(ApplicationResponseDto)로 변환
     */
    @Mapping(source = "member.userNo", target = "userNo") // Member 객체에서 userNo 추출
    @Mapping(source = "member.name", target = "userName") // Member 객체에서 이름 추출
    @Mapping(source = "worcation.worcationNo", target = "worcationNo") // Worcation 객체에서 ID 추출
    @Mapping(source = "worcation.worcationName", target = "worcationName") // 워케이션 이름
    @Mapping(source = "approve", target = "approve") // 승인 상태
    @Mapping(source = "startDate", target = "startDate") // 시작일
    @Mapping(source = "endDate", target = "endDate") // 종료일
    @Mapping(
            expression = "java(entity.getReview() != null ? entity.getReview().getReviewContent() : null)",
            target = "reviewContent"
    ) // 리뷰가 존재할 경우 내용 추출
    ApplicationResponseDto toDto(WorcationApplication entity);



    /**
     * 예약 등록용 DTO(ApplicationRequestDto) → WorcationApplication 엔티티로 변환
     * ※ 연관관계인 Member, Worcation, Review 등은 직접 Service에서 주입해야 함
     */
    @Mapping(target = "applicationNo", ignore = true) // PK는 DB에서 자동 생성
    @Mapping(target = "member", ignore = true)        // 사용자 정보는 Service에서 직접 설정
    @Mapping(target = "worcation", ignore = true)     // 워케이션 정보도 마찬가지
    @Mapping(target = "approve", ignore = true)       // 기본값은 null 또는 WAITING 상태
    @Mapping(target = "review", ignore = true)        // 최초 등록 시 리뷰는 없음
    @Mapping(target = "createAt", ignore = true)      // @CreationTimestamp로 자동 생성
    @Mapping(target = "updateAt", ignore = true)      // @UpdateTimestamp로 자동 업데이트
    WorcationApplication toEntity(ApplicationRequestDto dto);
}
