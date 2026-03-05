package com.minePing.BackEnd.service.userStateHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.enums.MemberEnums;
import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

import static com.minePing.BackEnd.redis.RedisKeys.ONLINE_KEY_PREFIX;

@Component
public class OfflineStateHandler extends AbstractUserStateHandler {

    public OfflineStateHandler(RedisTemplate<String, String> redisTemplate, OnlineWebSocketHandler onlineWebSocketHandler, ObjectMapper objectMapper) {
        super(redisTemplate, onlineWebSocketHandler, objectMapper);
    }

    @Override
    public void handle(UUID publicUuid) {
        redisTemplate.delete(ONLINE_KEY_PREFIX+publicUuid.toString());
    }

    @Override
    public void broadCast(UUID publicUuid) throws IOException {
        super.broadCast(publicUuid);
    }

    @Override
    public MemberEnums.Status getState() {
        return MemberEnums.Status.Offline;
    }
}
