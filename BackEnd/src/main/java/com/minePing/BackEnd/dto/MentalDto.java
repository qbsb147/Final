package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.MentalEnums;
import lombok.*;

import java.time.LocalDate;

public class MentalDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Integer score;
        private String result_content;
        private LocalDate update_date;

        public static Response toDto(Mental mental) {
            return Response.builder()
                    .score(mental.getScore())
                    .result_content(mental.getResultContent())
                    .update_date(mental.getUpdateDate())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StressRequest{
        private Integer stress1;
        private Integer stress2;
        private Integer stress3;
        private Integer stress4;
        private Integer stress5;
        private Integer stress6;
        private Integer stress7;
        private Integer stress8;
        private Integer stress9;
        private Integer stress10;
        private Integer stress11;
        private Integer stress12;
        private Integer stress13;
        private Integer stress14;
        private Integer stress15;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class BurnoutRequest{
        private Integer burnout1;
        private Integer burnout2;
        private Integer burnout3;
        private Integer burnout4;
        private Integer burnout5;
        private Integer burnout6;
        private Integer burnout7;
        private Integer burnout8;
        private Integer burnout9;
        private Integer burnout10;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MentalsResponse{
        private Response stress;
        private Response burnout;
        private MemberPreferenceDto.Result preference;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Main{
        private Integer score;
        private MentalEnums.PsychologicalState psychological_state;
        private LocalDate update_date;

        public static Main toDto(Mental mental) {
            return Main.builder()
                    .score(mental.getScore())
                    .psychological_state(mental.getPsychologicalState())
                    .update_date(mental.getUpdateDate())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MainResponse{
        private Main stress;
        private Main burnout;
    }
}



