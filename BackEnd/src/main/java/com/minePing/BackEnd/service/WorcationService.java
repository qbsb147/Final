package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.WorcationDto;
import java.util.List;

public interface WorcationService {
    /**
     * 새로운 워케이션을 생성하고, DTO 응답을 반환한다.
     */
    WorcationDto.Response create(WorcationDto.Request request);

    /**
     * 특정 ID의 워케이션 상세 정보를 조회한다.
     */
    WorcationDto.Response getById(Long worcationNo);

    /**
     * 워케이션 전체 목록(간단 요약) 조회
     */
    List<WorcationDto.Response> getAll();

    /**
     * 특정 워케이션을 수정하고, 수정된 DTO 응답을 반환한다.
     */
    WorcationDto.Response update(Long worcationNo, WorcationDto.Request request);

    /**
     * 특정 워케이션을 삭제한다.
     */
    void delete(Long worcationNo);
}
