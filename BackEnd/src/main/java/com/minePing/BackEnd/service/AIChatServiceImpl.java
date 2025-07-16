package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.AiDto.AIWorcationDto;
import com.minePing.BackEnd.dto.AiDto.AiEat;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.MentalEnums;
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


        Worcation first = worcations.get(0);

        // 💡 필요하면 LAZY 관계를 직접 접근해서 초기화
        WorcationDetail d = first.getWorcationDetail();
        WorcationFeatures f = first.getWorcationFeatures();

        AIWorcationDto dto = AIWorcationDto.toDto(burnout, stress, preference, first, d, f);

        // 전체 worcation 리스트 요약 전달
        List<Map<String, Object>> worcationList = worcations.stream().map(w -> {
            Map<String, Object> map = new HashMap<>();
            map.put("worcation_no", w.getWorcationNo());
            map.put("worcation_name", w.getWorcationName());
            map.put("worcation_category", w.getWorcationCategory());
            map.put("worcation_thema", w.getWorcationThema());
            map.put("max_people", w.getMaxPeople());

            WorcationFeatures wf = w.getWorcationFeatures();
            if (wf != null) {
                map.put("WlocationType", wf.getLocationType());
                map.put("WdominantColor", wf.getDominantColor());
                map.put("WspaceMood", wf.getSpaceMood());
                map.put("WbestFor", wf.getBestFor());
                map.put("activities", wf.getActivities());
                map.put("WaccommodationType", wf.getAccommodationType());
            }

            return map;
        }).toList();

        dto.setWorcationList(worcationList);
        System.out.println(dto);


        return worcations.stream()
            .map(w -> {
                WorcationDetail d = w.getWorcationDetail();
                WorcationFeatures f = w.getWorcationFeatures();
                return AIWorcationDto.toDto(mental, preference, w, d, f);
            })
            .collect(Collectors.toList());
    }


}
