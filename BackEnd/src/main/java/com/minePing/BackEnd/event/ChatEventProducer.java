package com.minePing.BackEnd.event;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatEventProducer {

    private final RedisTemplate<String, String> redisTemplate;

    public void sendReadEvent(Long roomNo, String userId) {
        // Redis Stream에 저장할 데이터
        Map<String, String> data = Map.of(
            "roomNo", roomNo.toString(),
            "publicUuid", userId
        );

        // chat_read_stream에 메시지 추가
        redisTemplate.opsForStream().add("chat_read_stream", data);
    }

}
