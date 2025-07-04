package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;
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
import jakarta.transaction.Transactional;
import java.time.LocalDate;
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
        Member member = memberRepository.findById(requestDto.getUserNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 🔒 워케이션 엔티티를 락 걸어서 조회
        Worcation worcation = worcationRepository.findByIdForUpdate(requestDto.getWorcationNo())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워케이션입니다."));

        // 🔥 인원 체크 및 차감 처리
        if (worcation.getMaxPeople() == null || worcation.getMaxPeople() <= 0) {
            throw new IllegalStateException("더 이상 신청할 수 없는 워케이션입니다.");
        }
        worcation.changeMaxPeople(worcation.getMaxPeople() - 1);

        // 신청 생성 (기본 상태 W: 대기)
        WorcationApplication entity = WorcationApplication.builder()
                .member(member)
                .worcation(worcation)
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .approve(CommonEnums.Approve.W)
                .build();

        applicationRepository.save(entity);

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

       //워케이션 업체별 신청 현황
    @Override
    public List<ApplicationDto.ReservedResponseDto> getReservedByWorcation(Long worcationNo) {
        return applicationRepository.findByWorcationNo(worcationNo).stream()
                .map(ApplicationDto.ReservedResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
