package com.minePing.BackEnd.service;

import java.util.List;

import com.minePing.BackEnd.dto.AiDto;
import com.minePing.BackEnd.dto.AiDto.AIWorcationDto;


public interface AIChatService {
    AiDto.AiEat getPromptDataByUser(Long userNo);
    List<AIWorcationDto> getAiWorcationByUser(Long userNo);
}