package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.event.ChatEvent;

import java.io.IOException;

public interface ChatKafkaConsumer {
    void consumeChatMessage(MessageDto.Request messageDto) throws IOException;
    void consumeUserStatus(ChatEvent.UserStateEvent userStateEvent) throws IOException;
    void consumeChatReadEvent(MessageReadStatusDto.Request request);
    void consumeChatReadDebeziumEvent(String payload) throws IOException;
}
