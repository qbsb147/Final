package com.minePing.BackEnd.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.mapper.WorcationMapper;
import com.minePing.BackEnd.repository.WorcationDetailRepository;
import com.minePing.BackEnd.repository.WorcationFeaturesRepository;
import com.minePing.BackEnd.repository.WorcationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorcationServiceImpl implements WorcationService {

    private final WorcationMapper mapper;
    private final WorcationRepository worcationRepository;
    private final WorcationDetailRepository detailRepository;
    private final WorcationFeaturesRepository featuresRepository;

    @Override
    @Transactional
    public WorcationDto.Response create(WorcationDto.Request request) {
        Worcation w = worcationRepository.save(mapper.toEntity(request));
        WorcationDetail d = detailRepository.save(mapper.toDetailEntity(request));
        WorcationFeatures f = featuresRepository.save(mapper.toFeaturesEntity(request));
        return mapper.toResponse(w, d, f);
    }

    @Override
    @Transactional(readOnly = true)
    public WorcationDto.Response getById(Long worcationNo) {
        Worcation w = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new RuntimeException("Worcation not found: " + worcationNo));
        WorcationDetail d = detailRepository.findById(worcationNo).orElse(null);
        WorcationFeatures f = featuresRepository.findById(worcationNo).orElse(null);
        return mapper.toResponse(w, d, f);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorcationDto.Response> getAll() {
        return worcationRepository.findAll().stream()
                .map(w -> {
                    WorcationDetail d = detailRepository.findById(w.getWorcationNo()).orElse(null);
                    WorcationFeatures f = featuresRepository.findById(w.getWorcationNo()).orElse(null);
                    return mapper.toResponse(w, d, f);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorcationDto.Response update(Long worcationNo, WorcationDto.Request request) {
        // 기존 엔티티 조회 후 변경 감지(dirty checking) 사용
        Worcation existing = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new RuntimeException("Worcation not found: " + worcationNo));

        // MapStruct를 사용하여 엔티티 업데이트
        mapper.updateFromDto(request, existing);
        // @PreUpdate에 의해 updateAt 자동 변경

        // Detail 엔티티 업데이트
        WorcationDetail existingDetail = detailRepository.findById(worcationNo)
                .orElseThrow(() -> new RuntimeException("WorcationDetail not found: " + worcationNo));
        mapper.updateDetailFromDto(request, existingDetail);

        // Features 엔티티 업데이트
        WorcationFeatures existingFeatures = featuresRepository.findById(worcationNo)
                .orElseThrow(() -> new RuntimeException("WorcationFeatures not found: " + worcationNo));
        mapper.updateFeaturesFromDto(request, existingFeatures);

        // 트랜잭션 커밋 시점에 dirty checking으로 자동 업데이트
        return mapper.toResponse(existing, existingDetail, existingFeatures);
    }

    @Override
    @Transactional
    public void delete(Long worcationNo) {
        worcationRepository.deleteById(worcationNo);
    }
}