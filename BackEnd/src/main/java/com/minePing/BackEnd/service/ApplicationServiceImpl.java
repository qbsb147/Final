package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.dto.ApplicationDto.ReservedResponseDto;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.ApplicationRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.WorcationDetailRepository;
import com.minePing.BackEnd.repository.WorcationFeaturesRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final WorcationRepository worcationRepository;
    private final WorcationDetailRepository detailRepository;
    private final WorcationFeaturesRepository featuresRepository;



    @Override
    @Transactional
    public List<ApplicationDto.ApplicationResponseDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(ApplicationDto.ApplicationResponseDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public ApplicationDto.ApplicationResponseDto getApplication(Long id) {
        WorcationApplication entity = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청이 존재하지 않습니다. id=" + id));
        return ApplicationDto.ApplicationResponseDto.fromEntity(entity);
    }
    @Override
    @Transactional
    public ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto) {
        //회원을 조회하고 존재하지 않는 회원이면 예외 발생
        Member member = memberRepository.findById(requestDto.getUserNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        //비관적 락으로 워케이션 조회
        //worcationNo로 워케이션 조회
        //findByIdForUpdate()는 비관적 락(Pessimistic Lock) 을 사용하여 다른 트랜잭션이 이 워케이션을 동시에 수정하거나 조회하는 것을 차단
        //동시성 문제를 방지하여 인원 초과 시 중복 신청 막음
        Worcation worcation = worcationRepository.findByIdForUpdate(requestDto.getWorcationNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워케이션입니다."));

        //현재 신청 인원 수 조회
        //해당 워케이션에 연관된 신청 목록 중 Y, W 상태인 신청 건만 필터링
        long approvedCount = worcation.getWorcationApplications().stream()
                .filter(app -> app.getApprove() == CommonEnums.Approve.W || app.getApprove() == CommonEnums.Approve.Y)
                .count();
        //현재 신청 인원이 max_people이상인 경우 예외를 발생시켜 신청을 막는다.
        if (approvedCount >= worcation.getMaxPeople()) {
            throw new IllegalStateException("해당 워케이션은 정원이 모두 찼습니다.");
        }

        //신청 엔티티 생성 신청자는 member, 워케이션은 worcation 날짜는 startDate, endDate
        //승인 상태는 초기에는 항상 대기(W) 로 설정
        WorcationApplication entity = WorcationApplication.builder()
                .member(member)
                .worcation(worcation)
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .approve(CommonEnums.Approve.W) // 신청 시 W(대기)
                .build();

        //DB에 신청 정보 저장
        applicationRepository.save(entity);

        //저장된 엔티티를 DTO 형태로 변환하여 반환
        //컨트롤러로 응답 전달
        return ApplicationDto.ApplicationResponseDto.fromEntity(entity);
    }

    @Override
    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 신청입니다. id=" + id);
        }
        applicationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, Boolean> getFullyReservedDates(Long worcationNo, LocalDate start, LocalDate end) {
        List<CommonEnums.Approve> statuses = List.of(CommonEnums.Approve.W, CommonEnums.Approve.Y);
        List<WorcationApplication> apps = applicationRepository.findInRangeWithStatus(worcationNo, start, end, statuses);

        // 날짜별 인원 수 집계
        Map<LocalDate, Long> dateCount = new HashMap<>();
        for (WorcationApplication app : apps) {
            LocalDate cur = app.getStartDate();
            while (!cur.isAfter(app.getEndDate())) {
                dateCount.put(cur, dateCount.getOrDefault(cur, 0L) + 1);
                cur = cur.plusDays(1);
            }
        }

        // 기준 인원보다 많은 날짜 추출
        Optional<Worcation> worcationOpt = worcationRepository.findById(worcationNo);
        int maxPeople = worcationOpt.map(Worcation::getMaxPeople).orElse(100); // 기본값 100
        Map<LocalDate, Boolean> result = new HashMap<>();
        for (LocalDate date : dateCount.keySet()) {
            result.put(date, dateCount.get(date) >= maxPeople);
        }

        return result;
    }

    @Override
    @Transactional
    public List<ApplicationDto.ApplicationResponseDto> getReservedByUser(Long userNo) {
        return applicationRepository.getReservedByUser(userNo, LocalDate.now())
                .stream()
                .map(ApplicationDto.ApplicationResponseDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public List<ApplicationDto.ApplicationResponseDto> getUsedByUser(Long userNo) {
        return applicationRepository.getUsedByUser(userNo, LocalDate.now())
                .stream()
                .map(ApplicationDto.ApplicationResponseDto::fromEntity)
                .toList();
       }

    @Override
    public List<ReservedResponseDto> getReservedByWorcation(Long worcationNo) {
        return List.of();
    }

    //워케이션 업체별 신청 현황
       @Override
       public List<LocalDate> getFullDates(Long worcationNo, String startDateStr, String endDateStr) {
           LocalDate startDate = LocalDate.parse(startDateStr);
           LocalDate endDate = LocalDate.parse(endDateStr);

           // 기간 내 모든 신청 가져오기
           List<WorcationApplication> applications = applicationRepository
                   .findByWorcationNoAndDateRange(worcationNo, startDate, endDate);

           // 날짜별 count 계산
           Map<LocalDate, Integer> dateCountMap = new HashMap<>();
           for (WorcationApplication app : applications) {
               LocalDate current = app.getStartDate();
               while (!current.isAfter(app.getEndDate())) {
                   dateCountMap.put(current, dateCountMap.getOrDefault(current, 0) + 1);
                   current = current.plusDays(1);
               }
           }

           // 해당 워케이션 최대 인원 수 조회
           Integer maxPeople = applications.stream().findFirst()
                   .map(app -> app.getWorcation().getMaxPeople())
                   .orElse(0);

           // 정원 초과 날짜만 추출
           List<LocalDate> fullDates = dateCountMap.entrySet().stream()
                   .filter(e -> e.getValue() >= maxPeople)
                   .map(Map.Entry::getKey)
                   .collect(Collectors.toList());

           return fullDates;
       }



}
