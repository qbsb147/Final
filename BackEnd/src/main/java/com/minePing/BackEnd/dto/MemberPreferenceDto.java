package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.PreferenceEnums;
import lombok.*;
import com.minePing.BackEnd.entity.MemberPreference;

public class MemberPreferenceDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private PreferenceEnums.Mbti mbti;
        private PreferenceEnums.PreferredColor preferred_color;
        private PreferenceEnums.PreferredLocation preferred_location;
        private PreferenceEnums.SpaceMood space_mood;
        private PreferenceEnums.ImportantFactor important_factor;
        private PreferenceEnums.LeisureActivity leisure_activity;
        private PreferenceEnums.AccommodationType accommodation_type;

        public MemberPreference toEntity() {
            return MemberPreference.builder()
                    .mbti(this.mbti)
                    .preferencedColor(this.preferred_color)
                    .preferencedLocation(this.preferred_location)
                    .spaceMood(this.space_mood)
                    .importantFactor(this.important_factor)
                    .leisureActivity(this.leisure_activity)
                    .accommodationType(this.accommodation_type)
                    .resultContent("어쩔티비")
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
}
