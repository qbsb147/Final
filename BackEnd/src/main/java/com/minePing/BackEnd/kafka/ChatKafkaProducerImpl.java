package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.event.ChatEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatKafkaProducerImpl implements ChatKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendChatMessage(MessageDto.Request messageDto){
        kafkaTemplate.send("chat_message", messageDto);
    }

    public void sendUserStatus(ChatEvent.UserStateEvent userStateEvent) {
        kafkaTemplate.send("user_status", userStateEvent);
    }

    public void sendChatReadEvent(MessageReadStatusDto.Request chatReadEvent) {
        kafkaTemplate.send("chat_read", chatReadEvent);
    }
}
