package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MemberPreferenceDto;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.service.MentalService;
import com.minePing.BackEnd.service.MemberPreferenceService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("api/v1/mental")
@RequiredArgsConstructor
public class MentalController {

    private final MentalService mentalService;
    private final MemberPreferenceService preferenceService;

    @GetMapping("")
    public ResponseEntity<List<MentalDto.Response>> getMental(){
        List<MentalDto.Response> response = mentalService.getMental();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stress")
    public ResponseEntity<Void> saveStress(@RequestBody MentalDto.StressRequest stressDto){
        mentalService.saveStress(stressDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/burnout")
    public ResponseEntity<Void> saveBurnout(@RequestBody MentalDto.BurnoutRequest burnoutDto){
        mentalService.saveBurnout(burnoutDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/preference")
    public ResponseEntity<Void> savePreference(@RequestBody MemberPreferenceDto.Request requestDto){
        preferenceService.savePreference(requestDto);
        return ResponseEntity.ok().build();
    }

}
