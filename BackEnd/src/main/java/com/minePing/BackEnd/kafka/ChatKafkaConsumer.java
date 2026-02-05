package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.event.ChatEvent;

import java.io.IOException;

public interface ChatKafkaConsumer {
    void consumeUserStatus(String message) throws IOException;
    void consumeChatReadEvent(ChatEvent.ChatReadEvent event);
    void consumeChatReadDebeziumEvent(String payload);
}
