package com.minePing.BackEnd.dto;

import lombok.*;
import com.minePing.BackEnd.entity.MemberPreference;

public class MemberPreferenceDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class Create {
        private String userNo;
        private String mbti;
        private String preferredColor;
        private String preferredLocation;
        private String spaceMood;
        private String importantFactor;
        private String leisureActivity;
        private String accommodationType;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long userNo;
        private String mbti;
        private String preferredColor;
        private String preferredLocation;
        private String spaceMood;
        private String importantFactor;
        private String leisureActivity;
        private String accommodationType;

        public static Response toDto(MemberPreference entity) {
            return Response.builder()
                    .userNo(entity.getMember().getUserNo())
                    .mbti(entity.getMbti().name())
                    .preferredColor(entity.getPreferencedColor().name())
                    .preferredLocation(entity.getPreferencedLocation().name())
                    .spaceMood(entity.getSpaceMood().name())
                    .importantFactor(entity.getImportantFactor().name())
                    .leisureActivity(entity.getLeisureActivity().name())
                    .accommodationType(entity.getAccommodationType().name())
                    .build();
        }

    }
}
