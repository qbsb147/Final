package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Mental;
import lombok.*;

public class MentalDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long user_no;                  // Member의 userNo
        private Integer score;
        private String psychological_state;    // Enum → String
        private String result_content;
        private String separation;            // Enum → String

        public static Response fromEntity(Mental entity) {
            return Response.builder()
                    .user_no(entity.getMember().getUserNo())
                    .score(entity.getScore())
                    .psychological_state(entity.getPsychologicalState().name())
                    .result_content(entity.getResultContent())
                    .separation(entity.getSeparation() != null ? entity.getSeparation().name() : null)
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
}