package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.event.ChatEvent;

public interface ChatKafkaProducer {
    void sendChatMessage(MessageDto.Request messageDto);
    void sendUserStatus(ChatEvent.UserStateEvent event);
    void sendChatReadEvent(MessageReadStatusDto.Request request);
}
