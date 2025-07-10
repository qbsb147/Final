package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.HealthDto;
import com.minePing.BackEnd.dto.HealthDto.Request;
import com.minePing.BackEnd.dto.HealthDto.Response;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.HealthRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthServiceImpl implements HealthService {

    private final HealthRepository healthRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Override
    public List<HealthDto.Response> findDtoByUserNo(Long userNo) {
        List<Health> healthList = healthRepository.findByMember_UserNo(userNo);

        return healthList.stream()
                .map(HealthDto.Response::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Response findByUserId() {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Health health = healthRepository.findByMember_UserId(userId)
                .orElseThrow(()-> new EntityNotFoundException("등록 되어있는 정보가 없습니다."));
        return Response.toDto(health);
    }

    @Override
    public void saveHealth(Request healthDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, Status.Y)
                .orElseThrow(UserNotFoundException::new);
        Health health = Request.toEntity(healthDto);
        health.changeMember(member);
        healthRepository.save(health);
    }

    @Override
    public void updateHealth(Request healthDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Health health = healthRepository.findByMember_UserId(userId)
                .orElseThrow(()-> new EntityNotFoundException("신체정보를 못 가져왔습니다."));
        Member member = memberRepository.findByUserIdAndStatus(userId, Status.Y)
                .orElseThrow(UserNotFoundException::new);
        health.changeThis(healthDto);
        health.changeMember(member);
    }
}