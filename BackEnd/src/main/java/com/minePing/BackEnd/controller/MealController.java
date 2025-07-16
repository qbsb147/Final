package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MealDto;
import com.minePing.BackEnd.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/meal")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @GetMapping("/check")
    public ResponseEntity<MealDto.check> check() {
        MealDto.check check = mealService.check();
        return ResponseEntity.ok(check);
    }
}
