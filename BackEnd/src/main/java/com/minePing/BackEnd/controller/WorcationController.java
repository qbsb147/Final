package com.minePing.BackEnd.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.PageResponse;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.dto.WorcationDto.WorcationReservation;
import com.minePing.BackEnd.service.WorcationService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;


import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("api/v1/worcations")
@RequiredArgsConstructor
@Validated
public class WorcationController {

    @Value("${business.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final WorcationService worcationService;

    /**
     * 워케이션 생성
     */
    @PostMapping
    public ResponseEntity<WorcationDto.Response> create(
            @RequestBody @Valid WorcationDto.Request request
    ) {
        WorcationDto.Response dto = worcationService.create(request);
        return ResponseEntity.created(
                URI.create("/api/worcations/" + dto.getWorcation_no())
        ).body(dto);
    }

    @PostMapping("/sample")
    public ResponseEntity<WorcationDto.Response> SampleCreate(
            @RequestBody @Valid WorcationDto.Request request
    ) {
        WorcationDto.Response dto = worcationService.SampleCreate(request);
        return ResponseEntity.created(
                URI.create("/api/worcations/" + dto.getWorcation_no())
        ).body(dto);
    }

    /**
     * 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorcationDto.Response> getById(
            @PathVariable("id") Long id
    ) {
        WorcationDto.Response dto = worcationService.getById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 전체 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<WorcationDto.Response>> getAll() {
        List<WorcationDto.Response> list = worcationService.getAll();
        return ResponseEntity.ok(list);
    }

    /**
     * 수정
     */
    @PatchMapping("/{id}")
    public ResponseEntity<WorcationDto.Response> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid WorcationDto.Request request
    ) {
        WorcationDto.Response dto = worcationService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        worcationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //본인이 작성한 워케이션 확인
    @GetMapping("/my-worcations")
    public ResponseEntity<Map<String, List<WorcationDto.SimpleResponse>>> getMyWorcations(@RequestParam Long userNo) {
        Map<String, List<WorcationDto.SimpleResponse>> result = worcationService.getMyWorcations(userNo);
        return ResponseEntity.ok(result);
    }


    //워케이션 등록목록
    @GetMapping("/my/{userNo}")
    public ResponseEntity<List<WorcationDto.WorcationListName>> getWorcationListName(@PathVariable Long userNo) {
        return ResponseEntity.ok(worcationService.getWorcationListName(userNo));
    }

    //예약자 목록
    @GetMapping("/reservaionList/{userNo}")
    public ResponseEntity<PageResponse<WorcationReservation>> getWorcationReservation(
            @PathVariable Long userNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable){
        return ResponseEntity.ok(new PageResponse<>(worcationService.getWorcationReservation(userNo,pageable)));
    }
//    // S3 Presigned URL 발급 API 만들기
//    @PostMapping("/presigned-url")
//    public ResponseEntity<String> getPresignedUrl(@RequestParam String filename) {
//        String url = worcationService.generatePresignedUrl(filename);
//        return ResponseEntity.ok(url);
//    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(@RequestParam MultipartFile file) {
        String savedName = worcationService.uploadWithoutWorcation(file); // worcation 없이 업로드
        return ResponseEntity.ok(savedName); // UUID+확장자만 반환
    }




}
