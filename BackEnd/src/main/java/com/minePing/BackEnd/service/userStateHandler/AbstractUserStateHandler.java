package com.minePing.BackEnd.service.userStateHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.enums.MemberEnums;
import com.minePing.BackEnd.enums.SocketEnums;
import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@RequiredArgsConstructor
public abstract class AbstractUserStateHandler implements UserStateHandler {

    protected final RedisTemplate<String, String> redisTemplate;
    protected final OnlineWebSocketHandler onlineWebSocketHandler;
    protected final ObjectMapper objectMapper;

    @Override
    public abstract void handle(UUID publicUuid);

    @Override
    public void broadCast(UUID publicUuid) throws IOException {
        MemberDto.Status statusDto = MemberDto.Status.builder()
                .public_uuid(publicUuid)
                .status(this.getState())
                .type(SocketEnums.type.STATUS)
                .build();

        Set<String> subscribers = redisTemplate.opsForSet()
                .members("user:" + publicUuid.toString() + ":subscribers");
        if (subscribers == null || subscribers.isEmpty()) return;

        String json = objectMapper.writeValueAsString(statusDto);

        for (String subscriber : subscribers) {
            try {
                UUID subscriberUuid = UUID.fromString(subscriber);
                WebSocketSession session = onlineWebSocketHandler.getSession(subscriberUuid);

                if (session != null && session.isOpen()) {
                    session.sendMessage(
                            new TextMessage(json)
                    );
                }
            } catch (IllegalArgumentException ignored) {
                // 잘못된 UUID 문자열인 경우 무시
            }
        }

        if(this.getState() == MemberEnums.Status.Offline){
            for (String subscriber:subscribers){
                redisTemplate.opsForSet()
                        .remove("user:" + subscriber + ":subscribers", publicUuid.toString());
            }
        }
    }

    @Override
    public abstract MemberEnums.Status getState();
}
