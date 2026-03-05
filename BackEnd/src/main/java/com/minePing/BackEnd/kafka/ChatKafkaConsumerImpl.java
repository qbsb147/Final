// KafkaConsumer.java
package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatKafkaConsumerImpl implements ChatKafkaConsumer{

    private final ChatService chatService;

    @KafkaListener(topics = "chat_message", groupId = "chat_service")
    public void consumeChatMessage(MessageDto.Request messageDto) throws IOException {
        chatService.consumeMessage(messageDto);
    }

    @KafkaListener(topics = "user_status", groupId = "chat_service")
    public void consumeUserStatus(ChatEvent.UserStateEvent userStateEvent) throws IOException {
        chatService.sessionStateChange(userStateEvent);
    }

    @KafkaListener(topics = "chat_read", groupId = "chat_service")
    public void consumeChatReadEvent(MessageReadStatusDto.Request chatReadEvent) {
        try {
            chatService.readMessage(chatReadEvent);
        } catch (Exception e){
            throw e;
        }
    }

    @KafkaListener(topics = "mineping_server.mineping.message_read_status", groupId = "chat_service", containerFactory = "kafkaStringListenerFactory")
    public void consumeChatReadDebeziumEvent(String payload) throws IOException {
        chatService.chatReadDebezium(payload);
    }

}
