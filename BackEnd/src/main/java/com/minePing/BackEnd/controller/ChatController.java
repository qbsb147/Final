package com.minePing.BackEnd.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.service.S3Service;
import com.minePing.BackEnd.dto.AiDto.AIWorcationDto;
import java.util.UUID;
import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.service.AIChatService;
import com.minePing.BackEnd.service.WorcationService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptions;
import org.springframework.ai.image.ImageOptionsBuilder;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private S3Service s3Service;

    @Autowired
    private ChatModel chatModel;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ImageModel imageModel;

    private final WorcationService worcationService;

    private final AIChatService aiChatService;


    @PostMapping("/diet-recommend/{userNo}")
    public Map<String, Object> recommendDiet(@PathVariable Long userNo) {
        Map<String, Object> response = new HashMap<>();

        List<Map<String, String>> meals = null;
        try {
            AiDto.AiEat dto = aiChatService.getPromptDataByUser(userNo);

            // 1. Prompt 구성 (String.format 사용)
            String promptText = String.format("""
                            너는 영양 전문가야.
                            다음은 한 사람의 건강 및 심리 상태 데이터야.
                            이 정보를 바탕으로 하루치 식단을 추천해줘. 아침, 점심, 저녁으로 나눠서 설명해줘. 간단한 이유도 함께 제시해.
                            
                            체중: %skg
                            키: %scm
                            BMI: %s
                            혈압: %s
                            혈당: %s
                            콜레스테롤: %s
                            흡연 여부: %s
                            식이 유형: %s
                            수면 시간: %s시간
                            음주 빈도: %s
                            건강 상태: %s
                            운동량: %s
                            
                            [번아웃]
                            심리 점수: %s
                            심리 상태: %s
                            분리 유형: %s
                            심리 결과 요약: %s
                            
                            [스트레스]
                            심리 점수: %s
                            심리 상태: %s
                            분리 유형: %s
                            심리 결과 요약: %s
                            
                            JSON 형식으로, 코드블록 없이 순수 JSON 배열 텍스트로 응답해줘.
                            각 끼니는 다음과 같은 형식을 따르되, 실제 내용(menu, reason)은 아래 예시와 다르게 사용자의 상태에 맞춰 만들어줘야 해.
                            
                            예시 (형식 참고용):
                            {
                              "meal": "아침",
                              "menu": "오트밀, 바나나",
                              "reason": "영양 밸런스를 위해"
                            }
                            """,
                    dto.getWeight(),
                    dto.getHeight(),
                    dto.getBmi(),
                    dto.getBloodPressure(),
                    dto.getBloodSugar(),
                    dto.getCholesterolLevel(),
                    dto.getSmokingStatus(),
                    dto.getDietType(),
                    dto.getSleepHours(),
                    dto.getAlcoholConsumption(),
                    dto.getHealthCondition(),
                    dto.getPhysicalActivity(),

                    dto.getBurnoutScore(),
                    dto.getBurnoutState(),
                    dto.getBurnoutSeparation(),
                    dto.getBurnoutSummary(),

                    dto.getStressScore(),
                    dto.getStressState(),
                    dto.getStressSeparation(),
                    dto.getStressSummary()
            );

            ChatClient chatClient = ChatClient.builder(chatModel).build();
            String chatResult = chatClient.prompt(promptText).call().content();

            // ===== 코드블록 (백틱) 제거 =====
            if (chatResult.startsWith("```")) {
                int firstNewline = chatResult.indexOf('\n');
                int lastBacktick = chatResult.lastIndexOf("```");
                if (firstNewline != -1 && lastBacktick > firstNewline) {
                    chatResult = chatResult.substring(firstNewline + 1, lastBacktick).trim();
                }
            }
            // ==============================

            // 2. JSON 파싱
            if (chatResult.startsWith("[")) {
                meals = objectMapper.readValue(chatResult, new TypeReference<>() {
                });
            }else if (chatResult.startsWith("{")) {
                Map<String, List<Map<String, String>>> map = objectMapper.readValue( chatResult, new TypeReference<>() {
                });
                meals = map.get("meals");
                if (meals == null) {
                    throw new RuntimeException("JSON에 'meals' 키가 없습니다.");
                }
            }else {
                throw new RuntimeException("알 수 없는 JSON 형식입니다.");
            }

            // 3. 영어 번역 + 이미지 생성
            for (Map<String, String> meal : meals) {
                String koreanMenu = meal.get("menu");

                String translatePromptText = String.format("한국어 식단 설명을 영어로 자연스럽게 번역해줘. 식단: %s", koreanMenu);
                String englishMenu = chatClient.prompt(translatePromptText).call().content();
                meal.put("menu_en", englishMenu);

                // 이미지 생성
                ImageOptions options = ImageOptionsBuilder.builder()
                        .model("dall-e-3")
                        .width(1024)
                        .height(1024)
                        .build();

                ImagePrompt imagePrompt = new ImagePrompt(englishMenu, options);
                ImageResponse imageResponse = imageModel.call(imagePrompt);
                String aiImageUrl = imageResponse.getResult().getOutput().getUrl();
                // S3 업로드용 키 생성
                String keyName = "images/" + UUID.randomUUID() + ".png";
                // AI 이미지 URL을 S3에 업로드 후 CloudFront URL 반환
                String s3ImageUrl = s3Service.uploadFromUrl(aiImageUrl, keyName);

                meal.put("imageUrl", s3ImageUrl);
            }
            response.put("status", "success");
            response.put("dietImageResults", meals);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("dietImageResults", meals);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @PostMapping("/worcation/{ids}")
    public Map<String, Object> recommendWorcation(@PathVariable("ids") Long userNo) {
        Map<String, Object> response = new HashMap<>();

        try {
            // ✅ DTO 1개: 사용자 심리/성향 + 워케이션 리스트 포함
            AiDto.AIWorcationDto dto = aiChatService.getAiWorcationByUser(userNo);

            // ✅ 워케이션 리스트 요약 구성
            StringBuilder worcationListStr = new StringBuilder();
            for (Map<String, Object> w : dto.getWorcationList()) {
                worcationListStr.append(String.format(
                        "워케이션 번호: %s, 상호명: %s, 업체 유형: %s, ...\n",
                        w.get("worcation_no"), w.get("worcation_name"), w.get("worcation_category")
                        // 필요하면 추가 필드 작성
                ));
            }

            // ✅ 프롬프트 작성
            String promptText = String.format("""
            너는 워케이션 장소를 추천해주는 전문가야.
            아래는 한 사람의 심리 및 성향 정보이고, 이어지는 정보는 등록된 워케이션 리스트야.
            이 사람에게 가장 적합한 워케이션 장소를 추천해줘

            MBTI: %s
            좋아하는 색상: %s
            선호하는 지역: %s
            공간 분위기: %s
            중요한 것: %s
            여가 활동: %s
            숙소 유형: %s

            [번아웃]
            심리 점수: %s
            심리 상태: %s
            분리 유형: %s
            심리 결과 요약: %s

            [스트레스]
            심리 점수: %s
            심리 상태: %s
            분리 유형: %s
            심리 결과 요약: %s

            %s

            아래 형식의 JSON 배열로만 결과를 줘. 코드블럭 없이 순수 JSON으로 줘야 해.
            그리고 예시에서 worcation_no에 번호를 넣어줄때 내가준 워케이션 번호를 넣어줘야해
            예시:
            [
              {
                worcation_no: 1
              },
              {
                worcation_no: 3
              }
            ]

            다른 텍스트는 절대 포함하지 마. JSON 배열만 응답해.
            """,
                    dto.getMbti(),
                    dto.getPreferredColor(),
                    dto.getPreferredLocation(),
                    dto.getSpaceMood(),
                    dto.getImportantFactor(),
                    dto.getLeisureActivity(),
                    dto.getAccommodationType(),

                    dto.getBurnoutScore(),
                    dto.getBurnoutPsychologicalState(),
                    dto.getBurnoutSeparation(),
                    dto.getBurnoutResultContent(),

                    dto.getStressScore(),
                    dto.getStressPsychologicalState(),
                    dto.getStressSeparation(),
                    dto.getStressResultContent(),

                    worcationListStr.toString()
            );

            // ✅ Gemini 또는 LLM 호출
            ChatClient chatClient = ChatClient.builder(chatModel).build();
            String chatResult = chatClient.prompt(promptText).call().content();

            // ✅ 코드블럭 제거
            if (chatResult.startsWith("```") && chatResult.contains("\n")) {
                int firstNewline = chatResult.indexOf('\n');
                int lastBacktick = chatResult.lastIndexOf("```");
                if (lastBacktick > firstNewline) {
                    chatResult = chatResult.substring(firstNewline + 1, lastBacktick).trim();
                }
            }

            // ✅ JSON 파싱
            List<Map<String, Object>> recommendations;
            if (chatResult.startsWith("[")) {
                recommendations = objectMapper.readValue(chatResult, new TypeReference<>() {});
            } else {
                throw new RuntimeException("AI 응답이 JSON 배열 형식이 아닙니다.");
            }

            response.put("recommendations", recommendations);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }
}
