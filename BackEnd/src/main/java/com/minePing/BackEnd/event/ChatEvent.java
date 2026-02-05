package com.minePing.BackEnd.event;

public class ChatEvent {

    // 읽음 처리 이벤트
    public record ChatReadEvent(Long roomNo, String userId) {}
}
