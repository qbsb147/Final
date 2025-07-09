package com.minePing.BackEnd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.enums.CommonEnums.Approve;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerDto {
    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("licensee")
    private String licensee;

    @JsonProperty("company_tel")
    private String companyTel;

    @JsonProperty("start_date")
    private String startDate;

    @JsonProperty("end_date")
    private String endDate;

    @JsonProperty("company_people")
    private int companyPeople;

    @JsonProperty("business_id")
    private String businessId;

    @JsonProperty("company_email")
    private String companyEmail;

    private Long worcationNo;
    private Long memberNo;
    private Long companyNo;

    @Getter
    @Setter
    @Builder
    public static class Response {
        private Long partnerNo;
        private String companyName;
        private String licensee;
        private String companyTel;
        private String companyEmail;
        private String businessId;
        private Integer companyPeople;
        private String startDate;
        private String endDate;
        private String approve;

        public static Response fromEntity(WorcationPartner partner) {
            return Response.builder()
                    .partnerNo(partner.getPartnerNo())
                    .companyName(partner.getCompany().getCompanyName())
                    .licensee(partner.getCompany().getLicensee())
                    .companyTel(partner.getCompany().getCompanyTel())
                    .companyEmail(partner.getCompany().getBusinessEmail())
                    .businessId(partner.getCompany().getBusinessId())
                    .companyPeople(partner.getCompanyPeople())
                    .startDate(partner.getStartTime().toString())
                    .endDate(partner.getEndTime().toString())
                    .approve(partner.getApprove().name())
                    .build();
        }
    }

    @Getter
    @Setter
    public class PartnerApproveRequestDto {
        private Approve approve; // W, Y, N 중 하나 (대기, 승인, 거절)
    }
}

