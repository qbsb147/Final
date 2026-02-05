package com.minePing.BackEnd.handler;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.service.ChatService;
import com.minePing.BackEnd.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class OnlineWebSocketHandler extends TextWebSocketHandler {

    private final ChatService chatService;
    // WebSocket 연결 시 보낸 JWT 토큰을 검증하기위한 객체
    private final JwtTokenProvider jwtTokenProvider;
    // 현재 연결된 모든 세션 관리
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private final RedisTemplate redisTemplate;

    //클라이언트가 WebSocket 연결을 시도하면 호출되는 메서드
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = (String) session.getAttributes().get("token");

        String userId;

        try{
            userId = jwtTokenProvider.parseClaims(token).getSubject();
        }catch (Exception e){
            session.close();
            return;
        }

        chatService.sessionOnline(userId);
    }

    //WebSocket 클라이언트가 연결을 끊었을 때 자동으로 호출
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //사용자의 WebSocket 세션을 roomSessions에서 제거
        String userId = Objects.requireNonNull(session.getPrincipal()).getName();
        chatService.sessionOffline(userId);
        System.out.println("disconnected!!");
    }

    public void sendStatusToSubscribers(String targetUserId, String status) throws IOException {

        // Redis에서 구독자 조회
        Set<String> subscribers = redisTemplate.opsForSet()
                .members("user:" + targetUserId + ":subscribers");

        if (subscribers == null) return;

        for (String subscriberId : subscribers) {
            WebSocketSession session = sessions.get(subscriberId);

            if (session != null && session.isOpen()) {
                session.sendMessage(
                        new TextMessage(targetUserId + ":" + status)
                );
            }
        }
    }
}