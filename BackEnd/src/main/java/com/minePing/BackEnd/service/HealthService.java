package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.HealthDto;
import java.util.List;

public interface HealthService {
    List<HealthDto.Response> findDtoByUserNo(Long userNo);
    HealthDto.Response findByUserId();
    void updateHealth(HealthDto.Request healthDto);
    void saveHealth(HealthDto.Request healthDto);

    // AI 관련: Health/심리 데이터를 합쳐 AI 입력용 DTO를 반환
    AiDto.AiEat getAiEatByUser(Long userNo);
}