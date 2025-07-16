package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.AiDto.AIWorcationDto;


public interface AIChatService {
    AiDto.AiEat getPromptDataByUser(Long userNo);
    AIWorcationDto getAiWorcationByUser(Long userNo);
}