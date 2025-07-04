package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;

import java.util.List;

public interface ApplicationService {

    List<ApplicationDto.ApplicationResponseDto> getAllApplications();

    ApplicationDto.ApplicationResponseDto getApplication(Long id);

    ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto);

    void deleteApplication(Long id);

    List<ApplicationDto.ApplicationResponseDto> getReservedByUser(Long userNo);
    List<ApplicationDto.ApplicationResponseDto> getUsedByUser(Long userNo);
    List<ApplicationDto.ReservedResponseDto> getReservedByWorcation(Long worcationNo);

}
