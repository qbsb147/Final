package com.minePing.BackEnd.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@RequestMapping("/business")
public class BusinessController {

    @Value("${business.api-key}")
    private String businessApiKey; // 반드시 인코딩된 키로 application.yml에 저장

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ 테스트용 엔드포인트
    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> res = new HashMap<>();
        res.put("message", "Business controller is working!");
        res.put("status", "success");
        return res;
    }

    // ✅ 사업자 진위 확인
    @PostMapping("/validate")
    public Map<String, Object> validateBusiness(@RequestBody Map<String, Object> request) {
        Map<String, Object> responses = new HashMap<>();
        try {
            String response = callValidateAPI(request);
            responses.put("api_response", response);
            responses.put("status", "success");
        } catch (Exception e) {
            responses.put("error", e.getMessage());
            responses.put("status", "error");
        }
        return responses;
    }

    // ✅ 사업자 상태 조회
    @PostMapping("/status")
    public Map<String, Object> checkBusinessStatus(@RequestBody Map<String, Object> request) {
        Map<String, Object> responses = new HashMap<>();
        try {
            String response = callStatusAPI(request);
            responses.put("api_response", response);
            responses.put("status", "success");
        } catch (Exception e) {
            responses.put("error", e.getMessage());
            responses.put("status", "error");
        }
        return responses;
    }

    // 🔧 사업자 진위확인 API 호출
    private String callValidateAPI(Map<String, Object> input) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.odcloud.kr/api/nts-businessman/v1/validate")
                .queryParam("serviceKey", businessApiKey)
                .build(false) // ❗ 인코딩된 키 유지
                .toUriString();

        Map<String, Object> body = new HashMap<>();
        body.put("businesses", List.of(input));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("사업자 진위확인 API 호출 실패: " + e.getMessage());
        }
    }

    // 🔧 사업자 상태조회 API 호출
    private String callStatusAPI(Map<String, Object> input) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.odcloud.kr/api/nts-businessman/v1/status")
                .queryParam("serviceKey", businessApiKey)
                .build(false)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(input, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("사업자 상태조회 API 호출 실패: " + e.getMessage());
        }
    }
}
