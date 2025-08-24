package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.dto.ApplicationDto.RemainingDto;
import com.minePing.BackEnd.dto.ApplicationDto.ReservedResponseDto;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Role;
import com.minePing.BackEnd.repository.ApplicationRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.WorcationDetailRepository;
import com.minePing.BackEnd.repository.WorcationFeaturesRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto) {
        //회원을 조회하고 존재하지 않는 회원이면 예외 발생
        Member member = memberRepository.findById(requestDto.getUserNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        //워케이션 조회 (비관적 락 제거 - 의미 없음)
        Worcation worcation = worcationRepository.findById(requestDto.getWorcationNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워케이션입니다."));

        // 날짜별 정원 체크 및 예약 겹침 검증 (범위 락으로 동시성 제어)
        validateApplicationAvailability(requestDto, member, worcation);

        //신청 엔티티 생성 신청자는 member, 워케이션은 worcation 날짜는 startDate, endDate
        //승인 상태는 초기에는 항상 대기(W) 로 설정
        WorcationApplication entity = WorcationApplication.builder()
                .member(member)
                .worcation(worcation)
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                // 신청 시 W(대기), role이 master이면 Y(승인)
                .approve(member.getRole() != Role.MASTER ? CommonEnums.Approve.Y :  CommonEnums.Approve.W)
                .build();

        //DB에 신청 정보 저장
        applicationRepository.save(entity);

        //저장된 엔티티를 DTO 형태로 변환하여 반환
        //컨트롤러로 응답 전달
        return ApplicationDto.ApplicationResponseDto.fromEntity(entity);
    }

    /**
     * 신청 가능성 검증 (날짜별 정원 체크, 예약 겹침 검증)
     */
    private void validateApplicationAvailability(ApplicationDto.ApplicationRequestDto requestDto, Member member, Worcation worcation) {
        LocalDate startDate = requestDto.getStartDate();
        LocalDate endDate = requestDto.getEndDate();
        Long worcationNo = requestDto.getWorcationNo();
        Long userNo = requestDto.getUserNo();

        // 1. 사용자의 동일 워케이션 중복 예약 체크
        List<CommonEnums.Approve> activeStatuses = List.of(CommonEnums.Approve.W, CommonEnums.Approve.Y);
        
        // 2. 날짜 범위에 대한 범위 락 획득 (동시 신청 방지)
        // 이 락은 트랜잭션 종료까지 유지되어 다른 트랜잭션이 같은 날짜 범위에 신청하는 것을 차단
        // 승인 상태가 W, Y인 신청 건만 락을 걸어 정확한 정원 체크 수행
        List<WorcationApplication> lockedApplications = applicationRepository
                .lockDateRangeForUpdate(worcationNo, startDate, endDate, activeStatuses);

        // 3. 사용자의 중복 예약 체크 (락이 걸린 상태에서 안전하게 수행)
        boolean hasExistingApplication = lockedApplications.stream()
                .anyMatch(app -> app.getMember().getUserNo().equals(userNo));
        
        if (hasExistingApplication) {
            throw new IllegalStateException("해당 기간에 이미 예약된 워케이션이 있습니다.");
        }

        // 날짜별 예약 인원 수 계산
        Map<LocalDate, Long> dateCountMap = new HashMap<>();
        for (WorcationApplication app : lockedApplications) {
            LocalDate current = app.getStartDate();
            while (!current.isAfter(app.getEndDate())) {
                dateCountMap.put(current, dateCountMap.getOrDefault(current, 0L) + 1);
                current = current.plusDays(1);
            }
        }

        // 신청하려는 기간의 각 날짜별로 정원 체크
        int maxPeople = worcation.getMaxPeople();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            long currentCount = dateCountMap.getOrDefault(date, 0L);
            if (currentCount >= maxPeople) {
                throw new IllegalStateException(
                    String.format("%s 날짜에 정원이 모두 찼습니다. (정원: %d명, 현재: %d명)", 
                        date, maxPeople, currentCount));
            }
        }
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
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            long currentCount = dateCount.getOrDefault(date, 0L);
            result.put(date, currentCount >= maxPeople);
        }

        return result;
    }

    /**
     * 특정 워케이션의 날짜별 예약 가능 인원 수 조회
     */
    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, Integer> getAvailableCapacityByDate(Long worcationNo, LocalDate start, LocalDate end) {
        List<CommonEnums.Approve> statuses = List.of(CommonEnums.Approve.W, CommonEnums.Approve.Y);
        List<WorcationApplication> apps = applicationRepository.findInRangeWithStatus(worcationNo, start, end, statuses);

        // 날짜별 예약 인원 수 집계
        Map<LocalDate, Long> dateCount = new HashMap<>();
        for (WorcationApplication app : apps) {
            LocalDate cur = app.getStartDate();
            while (!cur.isAfter(app.getEndDate())) {
                dateCount.put(cur, dateCount.getOrDefault(cur, 0L) + 1);
                cur = cur.plusDays(1);
            }
        }

        // 워케이션 최대 인원 수 조회
        Worcation worcation = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워케이션입니다."));
        int maxPeople = worcation.getMaxPeople();

        // 날짜별 예약 가능 인원 수 계산
        Map<LocalDate, Integer> result = new HashMap<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            long currentCount = dateCount.getOrDefault(date, 0L);
            int availableCapacity = Math.max(0, maxPeople - (int) currentCount);
            result.put(date, availableCapacity);
        }

        return result;
    }

    @Override
    @Transactional
    public List<ApplicationDto.ApplicationApplyDto> getReservedByUser(Long userNo) {
        return applicationRepository.getReservedByUser(userNo, LocalDate.now())
                .stream()
                .map(entity -> ApplicationDto.ApplicationApplyDto.toDto(entity, null))                .toList();
    }

    @Override
    @Transactional
    public List<ApplicationDto.ApplicationApplyDto> getUsedByUser(Long userNo) {
        return applicationRepository.getUsedByUser(userNo, LocalDate.now())
                .stream()
                .map(entity -> ApplicationDto.ApplicationApplyDto.toDto(entity, null))                .toList();
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

    @Override
    public List<RemainingDto> getRemainingByWorcation(Long worcationNo, String startDateStr, String endDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        List<WorcationApplication> applications =
                applicationRepository.findByWorcationNoAndDateRange(worcationNo, startDate, endDate);

        Map<LocalDate, Integer> countMap = new HashMap<>();
        for (WorcationApplication app : applications) {
            LocalDate cur = app.getStartDate();
            while (!cur.isAfter(app.getEndDate())) {
                countMap.put(cur, countMap.getOrDefault(cur, 0) + 1);
                cur = cur.plusDays(1);
            }
        }

        Worcation worcation = worcationRepository.findById(worcationNo)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워케이션입니다."));
    int maxPeople = worcation.getMaxPeople();

        List<RemainingDto> result = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            int used = countMap.getOrDefault(date, 0);
            result.add(new ApplicationDto.RemainingDto(date, maxPeople - used, maxPeople));
        }

        return result;
    }



}
