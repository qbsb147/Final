package com.minePing.BackEnd.config;

import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import com.minePing.BackEnd.handler.ChatRoomWebSocketHandler;
import com.minePing.BackEnd.handler.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final ChatRoomWebSocketHandler chatRoomWebSocketHandler;
    private final OnlineWebSocketHandler onlineWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        //WebSocket 요청을 처리할 핸들러(simpleWebSocketHandler)를 등록
        //CORS 허용 도메인 설정
        registry.addHandler(chatRoomWebSocketHandler, "/ws/v1/room")
                .addInterceptors(new WebSocketAuthInterceptor())
                .setAllowedOrigins("http://localhost:5173");

        // 로그인/온라인 상태 연결
        registry.addHandler(onlineWebSocketHandler, "/ws/v1/online")
                .addInterceptors(new WebSocketAuthInterceptor())
                .setAllowedOrigins("http://localhost:5173");
    }
}
/*
@EnableWebSocket: WebSocket 관련 설정을 활성화하는 어노테이션, 내부적으로 WebSocketConfigurer를 구현한 클래스를 자동으로 인식하여 WebSocket 핸들러를 등록하게 만듭니다.
*/