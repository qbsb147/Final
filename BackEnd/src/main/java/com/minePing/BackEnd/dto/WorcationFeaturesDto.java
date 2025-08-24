package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.WorcationEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class WorcationFeaturesDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private WorcationEnums.LocationType locationType;
        private WorcationEnums.DominantColor dominantColor;
        private WorcationEnums.SpaceMood spaceMood;
        private WorcationEnums.BestFor bestFor;
        private WorcationEnums.AccommodationType accommodationType;
    }
    public static Response toDto(WorcationFeatures worcationFeatures) {
        return Response.builder()
                .locationType(worcationFeatures.getLocationType())
                .dominantColor(worcationFeatures.getDominantColor())
                .spaceMood(worcationFeatures.getSpaceMood())
                .bestFor(worcationFeatures.getBestFor())
                .accommodationType(worcationFeatures.getAccommodationType())
                .build();
    }
}
