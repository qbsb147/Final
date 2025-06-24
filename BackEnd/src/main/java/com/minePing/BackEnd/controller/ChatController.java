package com.minePing.BackEnd.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * Gemini API와 연동하여 채팅 기능을 제공하는 컨트롤러
 */
@RestController
@RequestMapping("/chat")
public class ChatController {
    
    // application.yml에서 Gemini API 키를 주입받음
    @Value("${gemini.api-key}")
    private String geminiApiKey;
    
    // HTTP 요청을 위한 RestTemplate 인스턴스
    // Gemini API에 HTTP 요청을 보낼 때 사용했던 RestTemplate 인스턴스
    private final RestTemplate restTemplate = new RestTemplate();
    // ObjectMapper는 JSON 파싱/직렬화에 사용됨)
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 서버 동작 확인용 테스트 엔드포인트
     * @return 상태 메시지
     */
    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Chat controller is working!");
        response.put("status", "success");
        return response;
    }

    /**
     * Gemini AI와 GET 방식으로 대화
     * @param message 사용자 입력 메시지
     * @return Gemini 응답 및 상태
     */
    @GetMapping("/chat")
    public Map<String, String> chatGet(@RequestParam(defaultValue = "안녕하세요") String message) {
        Map<String, String> responses = new HashMap<>();
        try {
            String geminiResponse = callGeminiAPI(message); // Gemini API 호출
            responses.put("gemini 응답", geminiResponse);
            responses.put("status", "success");
        } catch (Exception e) {
            responses.put("error", e.getMessage());
            responses.put("status", "error");
        }
        responses.put("received_message", message);
        responses.put("method", "GET");
        return responses;
    }

    /**
     * Gemini AI와 POST 방식으로 대화
     * @param message 사용자 입력 메시지
     * @return Gemini 응답 및 상태
     */
    @PostMapping("/chat")
    public Map<String, String> chatPost(@RequestBody String message) {
        Map<String, String> responses = new HashMap<>();
        try {
            String geminiResponse = callGeminiAPI(message); // Gemini API 호출
            responses.put("gemini 응답", geminiResponse);
            responses.put("status", "success");
        } catch (Exception e) {
            responses.put("error", e.getMessage());
            responses.put("status", "error");
        }
        responses.put("received_message", message);
        responses.put("method", "POST");
        return responses;
    }
    
    /**
     * Gemini API에 실제로 요청을 보내는 메서드
     * @param prompt 사용자 프롬프트(질문)
     * @return Gemini의 응답 텍스트
     */
    private String callGeminiAPI(String prompt) {
        // Gemini API 호출 URL (모델명: gemini-1.5-flash)
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
        
        // 요청 바디 생성
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));
        
        try {
            // Gemini API에 POST 요청
            Map response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content_response = (Map) candidate.get("content");
                    List parts = (List) content_response.get("parts");
                    if (!parts.isEmpty()) {
                        Map part_response = (Map) parts.get(0);
                        return (String) part_response.get("text"); // Gemini 응답 텍스트 반환
                    }
                }
            }
            return "응답을 파싱할 수 없습니다.";
        } catch (Exception e) {
            throw new RuntimeException("Gemini API 호출 실패: " + e.getMessage());
        }
    }
}
