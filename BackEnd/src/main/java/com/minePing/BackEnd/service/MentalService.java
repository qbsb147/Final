package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MentalDto;
import org.springframework.http.ResponseEntity;

public interface MentalService {

    void saveStressResult(MentalDto.Create dto);
}
