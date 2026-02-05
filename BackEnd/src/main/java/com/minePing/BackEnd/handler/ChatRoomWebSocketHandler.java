package com.minePing.BackEnd.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.ChatMessageDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class ChatRoomWebSocketHandler extends TextWebSocketHandler {

  //WebSocket에 접속한 사용자 세션들을 채팅방 단위로 관리하기 위한 구조
    private final Map<Long, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    //수신한 채팅 메시지를 데이터베이스에 저장하는 비즈니스 로직을 담당
    private final ChatService chatService;
    //JSON 문자열을을 직렬화/역직렬화 하기위한 Jackson객체
    private final ObjectMapper objectMapper = new ObjectMapper();
    // WebSocket 연결 시 보낸 JWT 토큰을 검증하기위한 객체
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public ChatRoomWebSocketHandler(ChatService chatService, JwtTokenProvider jwtTokenProvider) {
        this.chatService = chatService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    //클라이언트가 WebSocket 연결을 시도하면 호출되는 메서드
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        MultiValueMap<String, String> params =
                UriComponentsBuilder.fromUri(uri).build().getQueryParams();

        ChatRoomDto.Request chatRoomDto = new ChatRoomDto.Request();
        chatRoomDto.setRoom_no(Long.valueOf(Objects.requireNonNull(params.getFirst("room_no"))));
        chatRoomDto.setToken((String) session.getAttributes().get("token"));

        // JWT 검증
        try {
            jwtTokenProvider.parseClaims(chatRoomDto.getToken());
            System.out.println("WebSocket JWT 인증 성공");
        } catch (Exception e) {
            System.out.println("WebSocket JWT 인증 실패: " + e.getMessage());
            session.close();
            return;
        }

        // 세션에 roomNo 저장 (나중에 연결 종료 시 필요)
        session.getAttributes().put("roomNo", chatRoomDto.getRoom_no());
        
        // roomId에 해당하는 세션 Set에 추가 (없으면 새로 생성)
        roomSessions.computeIfAbsent(chatRoomDto.getRoom_no(), k -> ConcurrentHashMap.newKeySet()).add(session);
        System.out.println("Connected : " + session.getId() + " to room " + chatRoomDto.getRoom_no());
    }

    //클라이언트가 보낸 메시지를 서버가 수신했을 때 호출
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    
        //JSON → DTO 변환
        String payload = message.getPayload();
        System.out.println("received message : " + payload);
        ChatMessageDto.Request chatMessageDto = objectMapper.readValue(payload, ChatMessageDto.Request.class);
        //메시지 DB 저장
        chatService.saveMessage(chatMessageDto.getRoom_no(), chatMessageDto);
        
        //해당 채팅방(roomNo)에만 브로드캐스트
        Long roomNo = chatMessageDto.getRoom_no();
        Set<WebSocketSession> targetSessions = roomSessions.get(roomNo);
        if (targetSessions != null) {
            for (WebSocketSession s : targetSessions) {
                if (s != session && s.isOpen()) {
                    s.sendMessage(new TextMessage(payload));
                }
            }
        }
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
}