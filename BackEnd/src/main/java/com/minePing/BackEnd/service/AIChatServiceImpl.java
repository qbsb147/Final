/*
package com.minePing.BackEnd.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.dto.HealthDto;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIChatServiceImpl implements AIChatService {

    private final MentalService mentalService;
    private final HealthService healthService;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${stablediffusion.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIChatServiceImpl(MentalService mentalService, HealthService healthService, ObjectMapper objectMapper) {
        this.mentalService = mentalService;
        this.healthService = healthService;
        this.objectMapper = objectMapper;
    }

    // 1. Stable Diffusion 이미지 생성 메서드 (기존 그대로 유지)
    private String generateImageFromPrompt(String prompt) {
        String url = "https://api.stability.ai/v2beta/stable-image/generate/ultra";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(apiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("prompt", prompt);
        builder.part("output_format", "webp");

        MultiValueMap<String, HttpEntity<?>> multipartBody = builder.build();

        HttpEntity<MultiValueMap<String, HttpEntity<?>>> request = new HttpEntity<>(multipartBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Object artifactsObj = response.getBody().get("artifacts");
            if (artifactsObj instanceof List<?> artifacts && !artifacts.isEmpty()) {
                Object first = artifacts.get(0);
                if (first instanceof Map<?, ?> firstMap) {
                    Object base64Obj = firstMap.get("base64");
                    if (base64Obj instanceof String base64 && !base64.isBlank()) {
                        return "data:image/webp;base64," + base64;
                    } else {
                        throw new RuntimeException("Stable Diffusion 응답에 base64 이미지가 없습니다.");
                    }
                }
            } else {
                throw new RuntimeException("Stable Diffusion 응답에 artifacts가 비어있습니다.");
            }
        }
        throw new RuntimeException("이미지 생성 실패: HTTP " + response.getStatusCode());
    }

    // 2. Gemini 응답에서 menu 추출 후 이미지 생성 메서드 추가
    private Map<String, String> extractMenusAndGenerateImages(String geminiJson) {
        Map<String, String> images = new HashMap<>();
        try {
            String cleanedJson = geminiJson.replaceAll("```json|```", "").trim();
            JsonNode root = objectMapper.readTree(cleanedJson);
            JsonNode eats = root.get("eats");

            if (eats != null && eats.isArray()) {
                for (JsonNode meal : eats) {
                    int time = meal.get("time").asInt();
                    String titleKo = meal.path("title_ko").asText("");
                    String menuKo = meal.path("menu_ko").asText("");
                    String explainKo = meal.path("explain_ko").asText("");
                    String menuEn = meal.path("menu_en").asText("");

                    // 프롬프트는 영어로만 전달
                    if (menuEn != null && !menuEn.isBlank()) {
                        String prompt = "A high-quality food photography of a healthy meal on a clean plate. Ingredients: " + menuEn;

                        String base64Image = generateImageFromPrompt(prompt);
                        if (base64Image != null) {
                            images.put("image_" + time, base64Image);
                        }
                    }

                    // 프론트에 전달할 한글 텍스트도 함께 저장 (선택)
                    images.put("title_ko_" + time, titleKo);
                    images.put("menu_ko_" + time, menuKo);
                    images.put("explain_ko_" + time, explainKo);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Gemini 응답 파싱 실패: " + e.getMessage());
        }
        return images;
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

                // 기존 finalPrompt 생성 부분 주석처리 (수정된 prompt 사용으로 대체)
                */
/*
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
                *//*

                // 새롭게 구성된 prompt로 변경
                finalPrompt = String.format("""
                [사용자 정신 상태]
                %s

                [사용자 신체 상태]
                %s

                위 정보를 참고하여 오늘 하루 식단을 건강하고 균형 있게 추천해 주세요. 그리고 HighCard는 고탄수입니다.
                        "eats": [
                          {
                            "time": 1,
                            "title_ko": "추천 조식 식단",
                            "menu_ko": "",
                            "explain_ko": "",
                            "menu_en": "",
                            "explain_en": ""
                          },
                          {
                            "time": 2,
                            "title_ko": "추천 중식 식단",
                            "menu_ko": "",
                            "explain_ko": "",
                            "menu_en": "",
                            "explain_en": ""
                          },
                          {
                            "time": 3,
                            "title_ko": "추천 석식 식단",
                            "menu_ko": "",
                            "explain_ko": "",
                            "menu_en": "",
                            "explain_en": ""
                          }
                        ],
                내 기준 형식에 맞춰서 만들어야 합니다. 맨 처음 알려주는 문구는 제거하고, 추가 설명은 필요 없습니다.
                """, mentalJson, healthJson);
            }

            String geminiResponse = callGeminiAPI(finalPrompt);
            responses.put("gemini 응답", geminiResponse);

            // 이미지 생성 결과 추가 (새로 추가한 메서드 호출)
            Map<String, String> imageMap = extractMenusAndGenerateImages(geminiResponse);
            responses.putAll(imageMap);

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
*/
