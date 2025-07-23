package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.dto.WorcationDto.Response;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.enums.PreferenceEnums;
import com.minePing.BackEnd.enums.PreferenceEnums.Mbti;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.enums.WorcationEnums;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class AiDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AiEat {

        // 건강 정보
        private Float weight;
        private Float height;
        private Float bmi;
        private String bloodPressure;
        private Float bloodSugar;
        private Integer cholesterolLevel;
        private String smokingStatus;
        private String dietType;
        private Double sleepHours;
        private String alcoholConsumption;
        private String healthCondition;
        private String physicalActivity;

        // 번아웃
        private Integer burnoutScore;
        private String burnoutState;
        private MentalEnums.Separation burnoutSeparation;
        private String burnoutSummary;

        // 스트레스
        private Integer stressScore;
        private String stressState;
        private MentalEnums.Separation stressSeparation;
        private String stressSummary;

        public static AiEat toDo(Health health, Mental burnout, Mental stress) {
            return AiEat.builder()
                    .weight(health.getWeight())
                    .height(health.getHeight())
                    .bmi(health.getBmi())
                    .bloodPressure(health.getBloodPressure())
                    .bloodSugar(health.getBloodSugar())
                    .cholesterolLevel(health.getCholesterolLevel())
                    .smokingStatus(health.getSmokingStatus())
                    .dietType(health.getDietType())
                    .sleepHours(health.getSleepHours())
                    .alcoholConsumption(health.getAlcoholConsumption().name())
                    .healthCondition(health.getHealthCondition())
                    .physicalActivity(health.getPhysicalActivity().name())

                    .burnoutScore(burnout.getScore())
                    .burnoutState(burnout.getPsychologicalState().name())
                    .burnoutSeparation(burnout.getSeparation())
                    .burnoutSummary(burnout.getResultContent())

                    .stressScore(stress.getScore())
                    .stressState(stress.getPsychologicalState().name())
                    .stressSeparation(stress.getSeparation())
                    .stressSummary(stress.getResultContent())

                    .build();
        }
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AIWorcationDto {

        // 🔹 번아웃 정보
        private String burnoutPsychologicalState;
        private String burnoutResultContent;
        private MentalEnums.Separation burnoutSeparation;
        private Integer burnoutScore;

        // 🔹 스트레스 정보
        private String stressPsychologicalState;
        private String stressResultContent;
        private MentalEnums.Separation stressSeparation;
        private Integer stressScore;

        // 🔹 성향 정보
        private Long userNo;
        private PreferenceEnums.Mbti mbti;
        private PreferenceEnums.PreferredColor preferredColor;
        private PreferenceEnums.PreferredLocation preferredLocation;
        private PreferenceEnums.SpaceMood spaceMood;
        private PreferenceEnums.ImportantFactor importantFactor;
        private PreferenceEnums.LeisureActivity leisureActivity;
        private PreferenceEnums.AccommodationType accommodationType;
        private String result_content;

        // 🔹 워케이션 리스트 (추천 대상이 되는 워케이션들의 정보 모음)
        private List<Map<String, Object>> worcationList;


        public static AIWorcationDto toDto(
                Mental burnout,
                Mental stress,
                MemberPreference preference,
                List<Map<String, Object>> worcationList
        ) {
            return AIWorcationDto.builder()
                    // 번아웃
                    .burnoutPsychologicalState(burnout.getPsychologicalState().name())
                    .burnoutSeparation(burnout.getSeparation())
                    .burnoutResultContent(burnout.getResultContent())
                    .burnoutScore(burnout.getScore())

                    // 스트레스
                    .stressPsychologicalState(stress.getPsychologicalState().name())
                    .stressSeparation(stress.getSeparation())
                    .stressResultContent(stress.getResultContent())
                    .stressScore(stress.getScore())

                    // 성향
                    .userNo(preference.getMember().getUserNo())
                    .mbti(preference.getMbti())
                    .preferredColor(preference.getPreferencedColor())
                    .preferredLocation(preference.getPreferencedLocation())
                    .spaceMood(preference.getSpaceMood())
                    .importantFactor(preference.getImportantFactor())
                    .leisureActivity(preference.getLeisureActivity())
                    .accommodationType(preference.getAccommodationType())
                    .result_content(preference.getResultContent())

                    // 워케이션 리스트
                    .worcationList(worcationList)
                    .build();
        }
    }

}
