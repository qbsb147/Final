package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MentalDto;

import java.util.List;

public interface MentalService {
    void saveStress(MentalDto.StressRequest stressDto);
    void saveBurnout(MentalDto.BurnoutRequest burnoutDto);
    MentalDto.MentalsResponse findMentals();
    MentalDto.MainResponse findMainMental();

}
