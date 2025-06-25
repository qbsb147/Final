package com.minePing.BackEnd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.dto.HealthDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIChatServiceImpl implements AIChatService {

    private final MentalService mentalService;
    private final HealthService healthService;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIChatServiceImpl(MentalService mentalService, HealthService healthService, ObjectMapper objectMapper) {
        this.mentalService = mentalService;
        this.healthService = healthService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, String> processChat(Long userNo, String message) {
        Map<String, String> responses = new HashMap<>();
        try {
            String finalPrompt = message;

            if (userNo != null) {
                List<MentalDto.Response> mentalList = mentalService.findDtoByUserNo(userNo);
                List<HealthDto.Response> healthList = healthService.findDtoByUserNo(userNo);

                String mentalJson = objectMapper.writeValueAsString(mentalList);
                String healthJson = objectMapper.writeValueAsString(healthList);

                // 예시: 하루 식단 추천 요청 메시지 구성
                finalPrompt = String.format("""
                [사용자 정신 상태]
                %s

                [사용자 신체 상태]
                %s

                위 정보를 참고하여 오늘 하루 식단을 건강하고 균형 있게 추천해 주세요. 그리고 HighCard는 고탄수입니다.
                          eats: [
                            {
                              time: 1,
                              title: '추천 조식 식단',
                              menu:
                              explain:
                            },
                            {
                              time: 2,
                              title: '추천 조식 식단',
                              menu:
                              explain:
                            },
                            {
                              time: 3,
                              title:
                              menu:
                              explain:
                            },
                          ],
                          내가준형식에 맞춰서 만들어야합니다.맨처음알려주는 문구만 없애고 내기준의 형식은 있어야합니다 추가설명은 필요없습니다.
                
                """, mentalJson, healthJson);
            }

            String geminiResponse = callGeminiAPI(finalPrompt);
            responses.put("gemini 응답", geminiResponse);
            responses.put("status", "success");
        } catch (Exception e) {
            responses.put("error", e.getMessage());
            responses.put("status", "error");
        }

        responses.put("received_message", message);
        responses.put("method", userNo != null ? "POST" : "GET");
        return responses;
    }

    private String callGeminiAPI(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(Map.of("text", prompt)));
        requestBody.put("contents", List.of(content));

        try {
            Map response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map contentResponse = (Map) candidate.get("content");
                    List parts = (List) contentResponse.get("parts");
                    if (!parts.isEmpty()) {
                        Map part = (Map) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            }
            return "응답을 파싱할 수 없습니다.";
        } catch (Exception e) {
            throw new RuntimeException("Gemini API 호출 실패: " + e.getMessage());
        }
    }
}
