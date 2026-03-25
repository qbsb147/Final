package com.minePing.BackEnd.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.enums.MemberEnums;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.kafka.ChatKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class OnlineWebSocketHandler extends TextWebSocketHandler {

    // WebSocket 연결 시 보낸 JWT 토큰을 검증하기위한 객체
    private final JwtTokenProvider jwtTokenProvider;
    // 현재 연결된 모든 세션 관리
    private final Map<UUID, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private final ChatKafkaProducer chatKafkaProducer;
    private final ObjectMapper objectMapper;

    //클라이언트가 WebSocket 연결을 시도하면 호출되는 메서드
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = (String) session.getAttributes().get("token");
        UUID publicUuid;

        try{
            String subject = jwtTokenProvider.parseClaims(token).getSubject();
            publicUuid = UUID.fromString(subject);
            System.out.println("WebSocket JWT 인증 성공");
        }catch (Exception e){
            System.out.println("WebSocket JWT 인증 실패: " + e.getMessage());
            session.close();
            return;
        }

        // attributes에 publicUuid 저장 (UUID 객체)
        session.getAttributes().put("publicUuid", publicUuid);
        sessions.put(publicUuid, session);

        ChatEvent.UserStateEvent userStateEvent = new ChatEvent.UserStateEvent(MemberEnums.Status.Online, publicUuid);
        chatKafkaProducer.sendUserStatus(userStateEvent);
    }

    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String token = (String) session.getAttributes().get("token");
        String subject = jwtTokenProvider.parseClaims(token).getSubject();
        UUID publicUuid = UUID.fromString(subject);

        MessageDto.Request messageDto = objectMapper.readValue(payload, MessageDto.Request.class);

        messageDto.setPublic_uuid(publicUuid);
        chatKafkaProducer.sendChatMessage(messageDto);
    }
    //WebSocket 클라이언트가 연결을 끊었을 때 자동으로 호출
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        UUID publicUuid = (UUID) session.getAttributes().get("publicUuid");
        ChatEvent.UserStateEvent userStateEvent = new ChatEvent.UserStateEvent(MemberEnums.Status.Offline, publicUuid);
        chatKafkaProducer.sendUserStatus(userStateEvent);
        System.out.println("disconnected!!");
    }

    public WebSocketSession getSession(UUID publicUuid){
        return sessions.get(publicUuid);
    }
}