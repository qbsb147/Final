package com.minePing.BackEnd.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.service.WorcationService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/worcations")
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


    @PostMapping("/validate")
    public ResponseEntity<?> validateBusiness(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("validateBusiness() 호출됨");// 메서드 호출 확인용 로그
            // 1. HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON); // 요청 본문이 JSON임을 명시 (Content-Type 헤더 설정)
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON)); // 응답도 JSON 형태로 받고 싶다는 뜻의 Accept 헤더 설정

            System.out.println(request);

            //2. 요청 본문 + 헤더를 하나의 HttpEntity로 감쌈
            // 외부 API 호출 시 이 객체가 request body로 사용됨
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            // 3. API 인증키를 URL에 포함시킬 수 있도록 인코딩 처리
            // 공백이나 특수문자가 있을 경우 문제가 발생하므로 URLEncoder 사용
            String encodedKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

            // 4. 실제 외부 API 요청 주소 생성
            // 사업자 진위 확인 API는 인증키(serviceKey)를 쿼리스트링으로 받음
            String url = UriComponentsBuilder.fromHttpUrl("https://api.odcloud.kr/api/nts-businessman/v1/validate")
                    .queryParam("serviceKey", apiKey) // 그냥 원본 키 그대로 전달
                    .toUriString();

            // 5. RestTemplate을 이용해 POST 요청 보내기
            // exchange()를 사용하면 메서드, 요청 본문, 응답 타입 등을 모두 지정할 수 있음
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,             // 호출할 URL
                    HttpMethod.POST, // HTTP 메서드
                    entity,          // 요청 본문 + 헤더
                    Map.class        // 응답 타입을 Map으로 받음 (JSON 파싱됨)
            );

            // 6. 외부 API로부터 받은 응답 로그 출력
            System.out.println("statusCode = " + response.getStatusCode()); // HTTP 상태 코드 출력
            System.out.println("body = " + response.getBody());  // 실제 응답 JSON 출력

            // 7. 응답 데이터를 클라이언트에게 그대로 전달
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            // 예외 발생 시 에러 로그 출력 및 클라이언트에 오류 메시지 반환
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    Map.of("error", "사업자 진위확인 실패: " + e.getMessage())
            );
        }
    }
}
