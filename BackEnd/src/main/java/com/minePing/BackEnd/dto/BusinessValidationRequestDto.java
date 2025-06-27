package com.minePing.BackEnd.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessValidationRequestDto {
    private String businessId;     // 사업자등록번호
    private String licensee;       // 사업자명
    private String worcationName;  // 상호명
    private String openDate;       // 개업일
    private String category;       // 업체 유형 (Office / Accommodation / OfficeAndStay)
}
