package com.minePing.BackEnd.service;

import java.util.Map;

public interface AIChatService {
    Map<String, String> processChat(Long userNo, String message);
}