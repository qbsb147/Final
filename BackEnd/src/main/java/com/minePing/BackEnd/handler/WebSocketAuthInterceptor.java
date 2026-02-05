package com.minePing.BackEnd.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {

        HttpHeaders headers = request.getHeaders();
        List<String> cookies = headers.get("Cookie");

        if (cookies == null || cookies.isEmpty()) {
            return false; // 쿠키 없음 → 인증 실패
        }

        String token = extractToken(cookies.get(0)); // 여기서 파싱
        attributes.put("token", token);              // 이후 Handler에서 사용

        return true; // handshake 허용
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
    }

    private String extractToken(String cookieHeader) {
        // "token=xxxx" 파싱
        for (String cookie : cookieHeader.split(";")) {
            cookie = cookie.trim();
            if (cookie.startsWith("token=")) {
                return cookie.substring("token=".length());
            }
        }
        return null;
    }
}
