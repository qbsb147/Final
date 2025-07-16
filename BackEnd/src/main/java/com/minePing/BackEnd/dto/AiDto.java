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
        // 번아웃 정보
        private String burnoutPsychologicalState;
        private String burnoutResultContent;
        private MentalEnums.Separation burnoutSeparation;
        private Integer burnoutScore;

        // 스트레스 정보
        private String stressPsychologicalState;
        private String stressResultContent;
        private MentalEnums.Separation stressSeparation;
        private Integer stressScore;

        private Long userNo;
        private PreferenceEnums.Mbti mbti;
        private PreferenceEnums.PreferredColor preferredColor;
        private PreferenceEnums.PreferredLocation preferredLocation;
        private PreferenceEnums.SpaceMood spaceMood;
        private PreferenceEnums.ImportantFactor importantFactor;
        private PreferenceEnums.LeisureActivity leisureActivity;
        private PreferenceEnums.AccommodationType accommodationType;
        private String result_content;


        private Member member;

        private Long worcation_no;
        private String worcation_name;
        private WorcationEnums.Category worcation_category;
        private String main_change_photo;
        private String worcation_thema;
        private Integer max_people;
        private String partner_price;
        private Integer non_partner_price;
        private String worcation_address;
        private LocalDateTime update_at;
        private LocalDateTime create_at;
        private CommonEnums.Status status;

        private Long area_id;

        // Detail
        private String licensee;
        private String business_id;
        private String worcation_tel;
        private Integer charge_amount;
        private String content;
        private String navigate;
        private String available_time;
        private String refund_policy;
        private LocalDate open_date;

        private WorcationEnums.LocationType WlocationType;
        private WorcationEnums.DominantColor WdominantColor;
        private WorcationEnums.SpaceMood WspaceMood;
        private WorcationEnums.BestFor WbestFor;
        private String activities;
        private WorcationEnums.AccommodationType WaccommodationType;

        private List<Map<String, Object>> worcationList;

        public static AIWorcationDto toDto(Mental burnout,
                                           Mental stress,
                                           MemberPreference memberPreference,
                                           Worcation w,
                                           WorcationDetail d,
                                           WorcationFeatures f) {
            return AIWorcationDto.builder()
                    // 번아웃 정보 세팅
                    .burnoutPsychologicalState(burnout.getPsychologicalState().name())
                    .burnoutSeparation(burnout.getSeparation())
                    .burnoutResultContent(burnout.getResultContent())
                    .burnoutScore(burnout.getScore())

                    // 스트레스 정보 세팅
                    .stressPsychologicalState(stress.getPsychologicalState().name())
                    .stressSeparation(stress.getSeparation())
                    .stressResultContent(stress.getResultContent())
                    .stressScore(stress.getScore())

                    // 성향 정보
                    .mbti(memberPreference.getMbti())
                    .preferredColor(memberPreference.getPreferencedColor())
                    .preferredLocation(memberPreference.getPreferencedLocation())
                    .spaceMood(memberPreference.getSpaceMood())
                    .importantFactor(memberPreference.getImportantFactor())
                    .leisureActivity(memberPreference.getLeisureActivity())
                    .accommodationType(memberPreference.getAccommodationType())
                    .result_content(memberPreference.getResultContent())
                    .userNo(memberPreference.getMember().getUserNo())

                    // 워케이션 기본정보
                    .worcation_no(w.getWorcationNo())
                    .worcation_name(w.getWorcationName())
                    .worcation_category(w.getWorcationCategory())
                    .main_change_photo(w.getMainChangePhoto())
                    .worcation_thema(w.getWorcationThema())
                    .max_people(w.getMaxPeople())
                    .partner_price(w.getPartnerPrice())
                    .non_partner_price(w.getNonPartnerPrice())
                    .worcation_address(w.getWorcationAddress())
                    .update_at(w.getUpdateAt())
                    .create_at(w.getCreateAt())
                    .status(w.getStatus())
                    .area_id(w.getSiggAreas() != null ? w.getSiggAreas().getId().longValue() : null)

                    // 상세정보
                    .licensee(d != null ? d.getLicensee() : null)
                    .business_id(d != null ? d.getBusinessId() : null)
                    .worcation_tel(d != null ? d.getWorcationTel() : null)
                    .charge_amount(d != null ? d.getChargeAmount() : null)
                    .content(d != null ? d.getContent() : null)
                    .navigate(d != null ? d.getNavigate() : null)
                    .available_time(d != null ? d.getAvailableTime() : null)
                    .refund_policy(d != null ? d.getRefundPolicy() : null)
                    .open_date(d != null ? d.getOpenDate() : null)

                    // 워케이션 특징
                    .WlocationType(f != null ? f.getLocationType() : null)
                    .WdominantColor(f != null ? f.getDominantColor() : null)
                    .WspaceMood(f != null ? f.getSpaceMood() : null)
                    .WbestFor(f != null ? f.getBestFor() : null)
                    .activities(f != null ? f.getActivities() : null)
                    .WaccommodationType(f != null ? f.getAccommodationType() : null)
                    .build();
        }

    }

}
