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
}