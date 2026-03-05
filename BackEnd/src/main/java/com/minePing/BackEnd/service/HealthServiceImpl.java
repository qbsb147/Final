package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.HealthDto;
import com.minePing.BackEnd.dto.HealthDto.Request;
import com.minePing.BackEnd.dto.HealthDto.Response;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.HealthRepository;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.MentalRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HealthServiceImpl implements HealthService {

    private final HealthRepository healthRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final MentalRepository mentalRepository;
    private final MemberPreferenceRepository memberPreferenceRepository;
    private final WorcationRepository worcationRepository;

    @Override
    public List<HealthDto.Response> findDtoByUserNo(Long userNo) {
        List<Health> healthList = healthRepository.findByMember_UserNo(userNo);

        return healthList.stream()
                .map(HealthDto.Response::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AiDto.AiEat getAiEatByUser(Long userNo) {
    Health health = healthRepository.findTopByMember_UserNoOrderByUpdateDateDesc(userNo)
        .orElseThrow(() -> new RuntimeException("Health 정보가 없습니다."));
    Mental burnout = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.BURNOUT)
        .orElseThrow(() -> new RuntimeException("번아웃 정보가 없습니다."));
    Mental stress = mentalRepository.findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(userNo, MentalEnums.Separation.STRESS)
        .orElseThrow(() -> new RuntimeException("스트레스 정보가 없습니다."));

    return AiDto.AiEat.toDo(health, burnout, stress);
    }

    @Override
    public Response findByUserId() {
        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();
        Health health = healthRepository.findByMember_PublicUuid(publicUuid)
                .orElseThrow(()-> new EntityNotFoundException("등록 되어있는 정보가 없습니다."));
        return Response.toDto(health);
    }

    @Override
    @Transactional
    public void saveHealth(Request healthDto) {
        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();
        Member member = memberRepository.findByPublicUuidAndStatus(publicUuid, Status.Y)
                .orElseThrow(UserNotFoundException::new);
        Health health = Request.toEntity(healthDto);
        health.changeMember(member);
        healthRepository.save(health);
    }

    @Override
    @Transactional
    public void updateHealth(Request healthDto) {
        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();
        Health health = healthRepository.findByMember_PublicUuid(publicUuid)
                .orElseThrow(()-> new EntityNotFoundException("신체정보를 못 가져왔습니다."));
        Member member = memberRepository.findByPublicUuidAndStatus(publicUuid, Status.Y)
                .orElseThrow(UserNotFoundException::new);
        health.changeThis(healthDto);
        health.changeMember(member);
        healthRepository.flush();
    }
}