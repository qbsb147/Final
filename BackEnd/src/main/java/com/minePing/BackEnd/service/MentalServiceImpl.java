package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.dto.MentalDto.Response;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.repository.MentalRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MentalServiceImpl implements MentalService {

    private final MentalRepository mentalRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public List<Response> getMental() {
        String user_id = jwtTokenProvider.getUserIdFromToken();
        List<Mental> mentalList= mentalRepository.getMental(user_id);
        return mentalList.stream()
            .map(MentalDto.Response::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public void saveStress(MentalDto.StressRequest stressDto) {

    }

    @Override
    public void saveBurnout(MentalDto.BurnoutRequest burnoutDto) {

    }
}
