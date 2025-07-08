package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.service.MentalService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("api/v1/mentals")
@RequiredArgsConstructor
public class MentalController {

    private final MentalService mentalService;

    @GetMapping("/{user_id}")
    public ResponseEntity<List<MentalDto.Response>> getMental(@PathVariable Long user_id){
        List<MentalDto.Response> response = mentalService.getMental(user_id);
        return ResponseEntity.ok(response);
    }

}
