package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.HealthDto;
import java.util.List;

public interface HealthService {
    List<HealthDto.Response> findDtoByUserNo(Long userNo);
    HealthDto.Response findByUserId();
    void updateHealth(HealthDto.Request healthDto);
    void saveHealth(HealthDto.Request healthDto);
}