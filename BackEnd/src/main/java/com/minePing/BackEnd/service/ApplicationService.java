package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;

import com.minePing.BackEnd.dto.WorcationDto;
import java.util.List;

public interface ApplicationService {

    List<ApplicationDto.ApplicationResponseDto> getAllApplications();

    ApplicationDto.ApplicationResponseDto getApplication(Long id);

    ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto);

    void deleteApplication(Long id);

    List<ApplicationDto.ApplicationResponseDto> getReserved();
    List<ApplicationDto.ApplicationResponseDto> getUsed();
}
