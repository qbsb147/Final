package com.minePing.BackEnd.service.userStateHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.enums.MemberEnums;
import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import static com.minePing.BackEnd.redis.RedisKeys.ONLINE_KEY_PREFIX;
import static com.minePing.BackEnd.redis.RedisKeys.TTL;

@Component
public class OnlineStateHandler extends AbstractUserStateHandler {

    public OnlineStateHandler(RedisTemplate<String, String> redisTemplate, OnlineWebSocketHandler onlineWebSocketHandler, ObjectMapper objectMapper) {
        super(redisTemplate, onlineWebSocketHandler, objectMapper);
    }

    @Override
    public void handle(UUID publicUuid) {
        redisTemplate.opsForValue()
                .set(ONLINE_KEY_PREFIX+publicUuid.toString(),"", Duration.ofSeconds(TTL));
    }

    @Override
    public void broadCast(UUID publicUuid) throws IOException {
        super.broadCast(publicUuid);
    }

    @Override
    public MemberEnums.Status getState() {
        return MemberEnums.Status.Online;
    }
}
