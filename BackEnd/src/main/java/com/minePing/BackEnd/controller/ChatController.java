package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.service.AIChatService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final AIChatService aiChatService;

    public ChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of("message", "Chat controller is working!", "status", "success");
    }

    @GetMapping("/chat")
    public Map<String, String> chatGet(@RequestParam(defaultValue = "안녕하세요") String message) {
        return aiChatService.processChat(null, message);
    }

//    @PostMapping("/chat/{userNo}")
//    public Map<String, String> chatPost(@PathVariable Long userNo, @RequestBody String message) {
//        return aiChatService.processChat(userNo, message);
//    }

    //임시데이터 로그인 불가능해서 2번값만가능하게
    @PostMapping("/chat")
    public Map<String, String> chatPost(@RequestBody String message) {
        Long userNo = 2L;  // 임시 고정값
        return aiChatService.processChat(userNo, message);
    }
}