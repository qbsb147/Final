package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.service.MentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/trial")
@RequiredArgsConstructor
public class MentalController {

    private MentalService mentalService;


}
