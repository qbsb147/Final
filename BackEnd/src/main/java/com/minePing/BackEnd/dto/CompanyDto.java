package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class CompanyDto {
    private Long company_no;
    private String company_name;
    private String business_id;
    private String licensee;
    private LocalDate open_date;
    private String company_address;
    private String business_email;
    private String company_tel;
    private CommonEnums.Status status;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Search {

        private Long company_no;
        private String company_name;
        private String company_address;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Validate {
        private Long company_no;
        private String open_date;
        private String licensee;
    }
}
