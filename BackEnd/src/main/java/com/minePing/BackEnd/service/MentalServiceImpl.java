package com.minePing.BackEnd.service;

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

    @Override
    public List<Response> getMental(Long user_id) {
        List<Mental> mentalList= mentalRepository.getMental(user_id);
        return mentalList.stream()
            .map(MentalDto.Response::fromEntity)
            .collect(Collectors.toList());
    }

}
