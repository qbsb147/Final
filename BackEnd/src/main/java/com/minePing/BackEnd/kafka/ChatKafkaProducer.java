package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.event.ChatEvent;

public interface ChatKafkaProducer {
    void sendOnline(String userId);
    void sendOffline(String userId);
    void sendChatReadEvent(ChatEvent.ChatReadEvent event);
}
