package com.minePing.BackEnd.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.enums.SocketEnums;
import com.minePing.BackEnd.kafka.ChatKafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.RetryOperations;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatRoomWebSocketHandler extends TextWebSocketHandler {

    //WebSocket에 접속한 사용자 세션들을 채팅방 단위로 관리하기 위한 구조
    private final Map<Long, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    // WebSocket 연결 시 보낸 JWT 토큰을 검증하기위한 객체
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public ChatRoomWebSocketHandler(JwtTokenProvider jwtTokenProvider, ChatKafkaProducer chatKafkaProducer, RetryOperations retryOperations) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    //클라이언트가 WebSocket 연결을 시도하면 호출되는 메서드
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        MultiValueMap<String, String> params =
                UriComponentsBuilder.fromUri(uri).build().getQueryParams();

        ChatRoomDto.Request chatRoomDto = ChatRoomDto.Request.builder()
                .room_no(Long.valueOf(Objects.requireNonNull(params.getFirst("room_no"))))
                .token((String) session.getAttributes().get("token"))
                .build();

        UUID publicUuid;

        // JWT 검증
        try {
            String subject = jwtTokenProvider.parseClaims(chatRoomDto.getToken()).getSubject();
            publicUuid = UUID.fromString(subject);
            System.out.println("WebSocket JWT 인증 성공");
        } catch (Exception e) {
            System.out.println("WebSocket JWT 인증 실패: " + e.getMessage());
            session.close();
            return;
        }

        // 세션에 roomNo 저장 (나중에 연결 종료 시 필요)
        session.getAttributes().put("roomNo", chatRoomDto.getRoom_no());
        session.getAttributes().put("publicUuid", publicUuid);

        // roomId에 해당하는 세션 Set에 추가 (없으면 새로 생성)
        roomSessions.computeIfAbsent(chatRoomDto.getRoom_no(), k -> ConcurrentHashMap.newKeySet()).add(session);
        System.out.println("Connected : " + session.getId() + " to room " + chatRoomDto.getRoom_no());
    }

    //WebSocket 클라이언트가 연결을 끊었을 때 자동으로 호출
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //사용자의 WebSocket 세션을 roomSessions에서 제거
        Long roomNo = (Long) session.getAttributes().get("roomNo");
        if (roomNo != null) {
            Set<WebSocketSession> sessions = roomSessions.get(roomNo);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    roomSessions.remove(roomNo);
                }
            }
        }
        System.out.println("disconnected!!");
    }

    public Set<WebSocketSession> getRoomSesstions(Long roomId){
        return roomSessions.getOrDefault(roomId, Collections.emptySet());
    }
}