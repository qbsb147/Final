package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
