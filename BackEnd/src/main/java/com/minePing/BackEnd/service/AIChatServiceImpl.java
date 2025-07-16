package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.AiDto.AIWorcationDto;
import com.minePing.BackEnd.dto.AiDto.AiEat;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.repository.HealthRepository;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MentalRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.text.html.parser.Entity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIChatServiceImpl implements AIChatService {


    private final HealthRepository healthRepository;
    private final MentalRepository mentalRepository;
    private final MemberPreferenceRepository preferenceRepository;
    private final WorcationRepository worcationRepository;

    @Override
    public AiDto.AiEat getPromptDataByUser(Long userNo) {
        Health health = healthRepository.findTopByMember_UserNoOrderByUpdateDateDesc(userNo)
                .orElseThrow(() -> new RuntimeException("Health 정보가 없습니다."));
        Mental burnout = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.BURNOUT)
                .orElseThrow(() -> new RuntimeException("번아웃 정보가 없습니다."));
        Mental stress = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.STRESS)
                .orElseThrow(() -> new RuntimeException("스트레스 정보가 없습니다."));
        return AiDto.AiEat.toDo(health, burnout, stress); // 아래에서 합쳐서 DTO 구성
    }

    @Override
    public AIWorcationDto getAiWorcationByUser(Long userNo) {
        Mental burnout = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.BURNOUT)
                .orElseThrow(() -> new RuntimeException("번아웃 정보가 없습니다."));
        Mental stress = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.STRESS)
                .orElseThrow(() -> new RuntimeException("스트레스 정보가 없습니다."));
        MemberPreference preference = preferenceRepository.findTopByMember_UserNoOrderByUpdateDateDesc(userNo)
                .orElseThrow(() -> new RuntimeException("성향 정보가 없습니다."));
        List<Worcation> worcations = worcationRepository.findAllBasic();

        if (worcations.isEmpty()) {
            throw new RuntimeException("워케이션 정보가 없습니다.");
        }

        // 워케이션 리스트 → Map으로 가공
        List<Map<String, Object>> worcationList = worcations.stream()
                .map(w -> {
                    WorcationDetail d = w.getWorcationDetail();
                    WorcationFeatures f = w.getWorcationFeatures();

                    Map<String, Object> map = new HashMap<>();
                    map.put("worcation_no", w.getWorcationNo());
                    map.put("worcation_name", w.getWorcationName());
                    map.put("worcation_category", w.getWorcationCategory());
                    map.put("worcation_thema", w.getWorcationThema());
                    map.put("max_people", w.getMaxPeople());
                    map.put("wlocation_type", f != null ? f.getLocationType() : null);
                    map.put("wdominant_color", f != null ? f.getDominantColor() : null);
                    map.put("wspace_mood", f != null ? f.getSpaceMood() : null);
                    map.put("wbest_for", f != null ? f.getBestFor() : null);
                    map.put("activities", f != null ? f.getActivities() : null);
                    map.put("waccommodation_type", f != null ? f.getAccommodationType() : null);
                    // 필요 시 필드 추가

                    return map;
                })
                .collect(Collectors.toList());

        // 하나의 DTO에 심리/성향 정보 + 워케이션 리스트 담아서 반환
        return AIWorcationDto.toDto(burnout, stress, preference, worcationList);
    }


}
