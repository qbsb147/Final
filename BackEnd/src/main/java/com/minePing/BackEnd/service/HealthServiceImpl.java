package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.HealthDto;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.repository.HealthRepository;
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

    @Override
    public List<HealthDto.Response> findDtoByUserNo(Long userNo) {
        List<Health> healthList = healthRepository.findByMember_UserNo(userNo);

        return healthList.stream()
                .map(HealthDto.Response::toDto)
                .collect(Collectors.toList());
    }
}