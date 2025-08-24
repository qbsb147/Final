package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ApplicationService {

    List<ApplicationDto.ApplicationResponseDto> getAllApplications();

    ApplicationDto.ApplicationResponseDto getApplication(Long id);

    ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto);

    void deleteApplication(Long id);

    Map<LocalDate, Boolean> getFullyReservedDates(Long worcationNo, LocalDate start, LocalDate end);

    List<ApplicationDto.ApplicationApplyDto> getReservedByUser(Long userNo);
    List<ApplicationDto.ApplicationApplyDto> getUsedByUser(Long userNo);
    List<ApplicationDto.ReservedResponseDto> getReservedByWorcation(Long worcationNo);

    List<LocalDate> getFullDates(Long worcationNo, String startDate, String endDate);

    List<ApplicationDto.RemainingDto> getRemainingByWorcation(Long worcationNo, String startDate, String endDate);

    /**
     * 특정 워케이션의 날짜별 예약 가능 인원 수 조회
     */
    Map<LocalDate, Integer> getAvailableCapacityByDate(Long worcationNo, LocalDate start, LocalDate end);

}
