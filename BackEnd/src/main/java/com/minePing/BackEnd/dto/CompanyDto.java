package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class CompanyDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CompanyJoinDto {

        @NotBlank(message = "회사명은 필수입니다.")
        private String company_name;

        @NotBlank(message = "회사 주소는 필수입니다.")
        private String company_address;

        @NotBlank(message = "사업자 등록번호는 필수입니다.")
        @Pattern(regexp = "^[0-9]{10}$", message = "10자리의 번호를 입력하셔야합니다.")
        private String business_id;

        @Email
        @NotBlank(message = "회사 이메일은 필수입니다.")
        private String business_email;

        @NotBlank(message = "사업자명은 필수입니다.")
        private String licensee;

        @NotBlank(message = "회사 번호는 필수입니다.")
        private String company_tel;

        @NotNull(message = "개업일 입력은 필수입니다.")
        @Past(message = "개업일은 과거 날짜여야 합니다.")
        private LocalDate open_date;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Search {

        private Long company_no;
        private String company_name;
        private String company_address;

        public static Search toDto(Company company) {
            return Search.builder()
                    .company_no(company.getCompanyNo())
                    .company_name(company.getCompanyName())
                    .company_address(company.getCompanyAddress())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Validate {
        private Long company_no;
        private String open_date;
        private String licensee;
    }
}
