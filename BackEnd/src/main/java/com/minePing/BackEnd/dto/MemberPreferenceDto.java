package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.PreferenceEnums;
import lombok.*;
import jakarta.validation.constraints.*;
import com.minePing.BackEnd.entity.MemberPreference;

import java.time.LocalDate;

public class MemberPreferenceDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        @NotNull(message = "mbti 정보가 없습니다.")
        private PreferenceEnums.Mbti mbti;
        @NotNull(message = "좋아하는 색상 정보가 없습니다.")
        private PreferenceEnums.PreferredColor preferred_color;
        @NotNull(message = "선호하는 지역 정보가 없습니다.")
        private PreferenceEnums.PreferredLocation preferred_location;
        @NotNull(message = "공간 분위기 정보가 없습니다.")
        private PreferenceEnums.SpaceMood space_mood;
        @NotNull(message = "중요한 것 정보가 없습니다.")
        private PreferenceEnums.ImportantFactor important_factor;
        @NotNull(message = "여가 활동 정보가 없습니다.")
        private PreferenceEnums.LeisureActivity leisure_activity;
        @NotNull(message = "숙소 유형 정보가 없습니다.")
        private PreferenceEnums.AccommodationType accommodation_type;

        private String result_content;

        public MemberPreference toEntity() {
            return MemberPreference.builder()
                    .mbti(this.mbti)
                    .preferencedColor(this.preferred_color)
                    .preferencedLocation(this.preferred_location)
                    .spaceMood(this.space_mood)
                    .importantFactor(this.important_factor)
                    .leisureActivity(this.leisure_activity)
                    .accommodationType(this.accommodation_type)
                    .resultContent(this.result_content)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private PreferenceEnums.Mbti mbti;
        private PreferenceEnums.PreferredColor preferred_color;
        private PreferenceEnums.PreferredLocation preferred_location;
        private PreferenceEnums.SpaceMood space_mood;
        private PreferenceEnums.ImportantFactor important_factor;
        private PreferenceEnums.LeisureActivity leisure_activity;
        private PreferenceEnums.AccommodationType accommodation_type;

        public static Response toDto(MemberPreference entity) {
            return Response.builder()
                    .mbti(entity.getMbti())
                    .preferred_color(entity.getPreferencedColor())
                    .preferred_location(entity.getPreferencedLocation())
                    .space_mood(entity.getSpaceMood())
                    .important_factor(entity.getImportantFactor())
                    .leisure_activity(entity.getLeisureActivity())
                    .accommodation_type(entity.getAccommodationType())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Result {
        private String result_content;
        private LocalDate update_date;

        public static Result toDto(MemberPreference memberPreference) {
            return Result.builder()
                    .result_content(memberPreference.getResultContent())
                    .update_date(memberPreference.getUpdateDate())
                    .build();
        }
    }
}
