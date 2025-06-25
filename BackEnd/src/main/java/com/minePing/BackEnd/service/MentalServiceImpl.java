package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.repository.MentalRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MentalServiceImpl implements MentalService {

//    @Override
//    public void saveStressResult(Create dto) {
//
//    }

    private final MentalRepository mantalRepository;

    @Override
    public List<MentalDto.Response> findDtoByUserNo(Long userNo) {
        List<Mental> MentalList = mantalRepository.findByMember_UserNo(userNo);
        return MentalList.stream()
                .map(MentalDto.Response::toDto)
                .collect(Collectors.toList());
    }
}
