package com.minePing.BackEnd.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.PageResponse;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.dto.WorcationDto.Response;
import com.minePing.BackEnd.dto.WorcationDto.WorcationReservation;
import com.minePing.BackEnd.entity.WorcationFeatures;
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
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.data.domain.PageRequest;

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
     * (워케이션 권한이 있는 사용자만 생성 가능)
     */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_WORCATION')")
    public ResponseEntity<WorcationDto.Response> create(
            @RequestBody @Valid WorcationDto.Request request) {
        WorcationDto.Response dto = worcationService.create(request);
        return ResponseEntity.created(
                URI.create("/api/worcations/" + dto.getWorcation_no())).body(dto);
    }

    /**
     * 임시 저장 (워케이션 권한이 있는 사용자만 가능)
     */
    @PostMapping("/tmp")
    @PreAuthorize("hasRole('ROLE_WORCATION')")
    public ResponseEntity<Void> tempSave(@RequestBody WorcationDto.Request request) {
        worcationService.tmpSave(request); // 임시저장 로직
        return ResponseEntity.ok().build();
    }

    /**
     * 단건 조회 (공개)
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorcationDto.Response> getById(
            @PathVariable("id") Long id) {
        WorcationDto.Response dto = worcationService.getById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 여러개 목록 조회
     */
    @GetMapping("/ids")
    public List<WorcationDto.Response> getWorcationsByIds(@RequestParam("ids") List<Long> ids) {
        return worcationService.findByIds(ids);
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
     * 내 목록 조회
     */
    @GetMapping("list/all/{id}")
    public ResponseEntity<List<Response>> getLISTALL(@PathVariable("id") Long id) {
        List<WorcationDto.Response> dto = worcationService.getMyListALl(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 수정 (작성자/소유자만)
     */
    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorcationDto.Response> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid WorcationDto.Request request) {
        System.out.println("request = " + request.getWorcation_category());
        WorcationDto.Response dto = worcationService.update(id, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * 삭제 (작성자/소유자만)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        worcationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 본인이 작성한 워케이션 확인 (본인만)
     */
    @GetMapping("/my-worcations/{userNo}")
    @PreAuthorize("isAuthenticated()") // 본인만
    public ResponseEntity<Map<String, List<WorcationDto.SimpleResponse>>> getMyWorcations(@PathVariable Long userNo) {
        Map<String, List<WorcationDto.SimpleResponse>> result = worcationService.getMyWorcations(userNo);
        return ResponseEntity.ok(result);
    }

    /**
     * 워케이션 등록목록 (본인만)
     */
    @GetMapping("/my/{userNo}")
    @PreAuthorize("isAuthenticated()") // 본인만
    public ResponseEntity<List<WorcationDto.WorcationListName>> getWorcationListName(@PathVariable Long userNo) {
        return ResponseEntity.ok(worcationService.getWorcationListName(userNo));
    }

    /**
     * 예약자 목록 (워케이션 소유자만)
     */
    @GetMapping("/reservaionList/{userNo}")
    @PreAuthorize("isAuthenticated()") // 소유자만
    public ResponseEntity<PageResponse<WorcationReservation>> getWorcationReservation(
            @PathVariable Long userNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(worcationService.getWorcationReservation(userNo, pageable)));
    }

     // // S3 Presigned URL 발급 API 만들기
    // @PostMapping("/presigned-url")
    // public ResponseEntity<String> getPresignedUrl(@RequestParam String filename)
    // {
    // String url = worcationService.generatePresignedUrl(filename);
    // return ResponseEntity.ok(url);
    // }
    /**
     * 사진 업로드 (로그인한 사용자만 업로드 가능)
     */
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()") // 로그인한 사용자만 업로드 가능
    public ResponseEntity<String> uploadPhoto(@RequestParam MultipartFile file) {
        String savedName = worcationService.uploadWithoutWorcation(file); // worcation 없이 업로드
        return ResponseEntity.ok(savedName); // UUID+확장자만 반환
    }

    @GetMapping("/ai")
    public ResponseEntity<PageResponse<WorcationDto.Simple>> getAI(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(new PageResponse<>(worcationService.getAIList(pageable)));
    }
}
