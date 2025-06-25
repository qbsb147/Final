package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.WorcationEnums;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class WorcationDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        //Worcation
        private String worcationName;
        private WorcationEnums.Category worcationCategory;
        private String mainChangePhoto;
        private String worcationThema;
        private Integer maxPeople;
        private String partnerPrice;
        private Integer nonPartnerPrice;
        private String worcationAddress;
        private Long memberId;
        private Long areaId;

        // Detail
        private String licensee;
        private String businessId;
        private String worcationTel;
        private Integer chargeAmount;
        private String content;
        private String navigate;
        private String availableTime;
        private String refundPolicy;
        private LocalDate openDate;

        // Features
        private WorcationEnums.LocationType locationType;
        private WorcationEnums.DominantColor dominantColor;
        private WorcationEnums.SpaceMood spaceMood;
        private WorcationEnums.BestFor bestFor;
        private String activities;
        private WorcationEnums.AccommodationType accommodationType;

        private List<String> amenities;
        private List<String> photoUrls;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        //Worcation
        private Long worcationNo;
        private String worcationName;
        private WorcationEnums.Category worcationCategory;
        private String mainChangePhoto;
        private String worcationThema;
        private Integer maxPeople;
        private String partnerPrice;
        private Integer nonPartnerPrice;
        private String worcationAddress;
        private LocalDateTime updateAt;
        private LocalDateTime createAt;
        private CommonEnums.Status status;

        private Long memberId;
        private Long areaId;

        // Detail
        private String licensee;
        private String businessId;
        private String worcationTel;
        private Integer chargeAmount;
        private String content;
        private String navigate;
        private String availableTime;
        private String refundPolicy;
        private LocalDate openDate;

        // Features
        private WorcationEnums.LocationType locationType;
        private WorcationEnums.DominantColor dominantColor;
        private WorcationEnums.SpaceMood spaceMood;
        private WorcationEnums.BestFor bestFor;
        private String activities;
        private WorcationEnums.AccommodationType accommodationType;

        private List<String> amenities;
        private List<String> photoUrls;
    }
}
