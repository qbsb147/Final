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

}
