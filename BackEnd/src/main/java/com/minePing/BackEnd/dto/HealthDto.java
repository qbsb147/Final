package com.minePing.BackEnd.dto;

import lombok.*;

public class HealthDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long user_no;       // Member 엔티티의 userNo (user_no 컬럼)
        private Float weight;
        private Float height;
        private Float bmi;
        private String blood_pressure;
        private Float blood_sugar;
        private String health_condition; // Enum은 String으로 변환해서 DTO에 담기
        private Integer cholesterol_level;
        private String smoking_status;    // Enum을 String으로
        private String alcohol_consumption;
        private String physical_activity;
        private Double sleep_hours;
        private String diet_type;

        // 엔티티 → DTO 변환 메서드
        public static Response toDto(com.minePing.BackEnd.entity.Health entity){
            return Response.builder()
                    .user_no(entity.getMember().getUserNo())  // Member의 userNo 필드명에 따라 변경
                    .weight(entity.getWeight())
                    .height(entity.getHeight())
                    .bmi(entity.getBmi())
                    .blood_pressure(entity.getBloodPressure())
                    .blood_sugar(entity.getBloodSugar())
                    .health_condition(entity.getHealthCondition().name())
                    .cholesterol_level(entity.getCholesterolLevel())
                    .smoking_status(entity.getSmokingStatus().name())
                    .alcohol_consumption(entity.getAlcoholConsumption().name())
                    .physical_activity(entity.getPhysicalActivity().name())
                    .sleep_hours(entity.getSleepHours())
                    .diet_type(entity.getDietType())
                    .build();
        }
    }
}