package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MentalDto;

import java.util.List;

public interface MentalService {

    List<MentalDto.Response> getMental(Long user_id);


}
