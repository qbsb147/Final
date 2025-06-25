package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.mapper.ApplicationMapper;
import com.minePing.BackEnd.repository.ApplicationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;

    @Override
    public List<ApplicationDto.ApplicationResponseDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(e -> applicationMapper.toDto(e)) // 람다식 사용으로 타입 추론 오류 방지
                .toList();
    }

    @Override
    public ApplicationDto.ApplicationResponseDto getApplication(Long id) {
        WorcationApplication entity = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 신청이 존재하지 않습니다. id=" + id));
        return applicationMapper.toDto(entity);
    }

    @Override
    @Transactional
    public ApplicationDto.ApplicationResponseDto createApplication(ApplicationDto.ApplicationRequestDto requestDto) {
        WorcationApplication entity = applicationMapper.toEntity(requestDto);
        WorcationApplication saved = applicationRepository.save(entity);
        return applicationMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 신청입니다. id=" + id);
        }
        applicationRepository.deleteById(id);
    }
}
