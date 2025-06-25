package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MentalDto;
import java.util.List;

public interface MentalService {

//    void saveStressResult(MentalDto.Create dto);

    List<MentalDto.Response> findDtoByUserNo(Long userNo);
}
