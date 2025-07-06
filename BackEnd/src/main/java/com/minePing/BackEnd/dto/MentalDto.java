package com.minePing.BackEnd.dto;

import lombok.*;


public class MentalDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Create {
        private String userNo;
        private java.util.Map<String, String> answers;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long userNo;                  // Member의 userNo
        private Integer score;
        private String psychological_state;  // Enum → String (무조건 값 있음)
        private String result_content;
        private String separation;            // Enum → String (무조건 값 있음)

        public static Response toDto(com.minePing.BackEnd.entity.Mental entity) {
            return Response.builder()
                    .userNo(entity.getMember().getUserNo())
                    .score(entity.getScore())
                    .psychological_state(entity.getPsychologicalState().name())
                    .result_content(entity.getResultContent())
                    .separation(entity.getSeparation().name())
                    .build();
        }
    }
}