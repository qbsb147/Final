// KafkaConsumer.java
package com.minePing.BackEnd.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import com.minePing.BackEnd.repository.MessageReadStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatKafkaConsumerImpl implements ChatKafkaConsumer{

    private final OnlineWebSocketHandler webSocketHandler;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final ObjectMapper objectMapper;
    private final String workerId;

    @KafkaListener(topics = "user-status", groupId = "chat_service")
    public void consumeUserStatus(String message) throws IOException {
        String[] parts = message.split("\\|");
        String status = parts[0];
        String userId = parts[1];

        webSocketHandler.sendStatusToSubscribers(userId, status);
    }

    @KafkaListener(topics = "chat_read_event", groupId = "chat_service")
    public void consumeChatReadEvent(ChatEvent.ChatReadEvent event) {
        try {
            // 읽음 상태 변경
            messageReadStatusRepository.updateRead(event.roomNo(), event.userId(), workerId);

        } catch (Exception e) {
            // Kafka Retry 정책에 따라 재처리될 수 있음
            log.error("ChatReadEvent 처리 실패 → 재시도 예정", e);
            throw e; // 예외를 던져야 Kafka가 재시도함
        }
    }

    @KafkaListener(topics = "mineping_server.mineping.message_read_status", groupId = "chat_service")
    public void consumeChatReadDebeziumEvent(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);
            String op = root.get("op").asText(); // u, c, d

            if (!"u".equals(op)) return; // update 이벤트만 처리

            JsonNode after = root.get("after");
            Long roomNo = after.get("room_no").asLong();
            String userId = after.get("user_id").asText();
            boolean read = after.get("read").asBoolean();
            String workerId = after.get("worker_id").asText();

            if (Objects.equals(workerId, this.workerId))return;

            if (read) {
                messageReadStatusRepository
                        .updateRead(roomNo, userId, this.workerId);
            }

        } catch (Exception e) {
            // Kafka Retry 정책에 따라 재처리될 수 있음
            throw new RuntimeException("Debezium ChatReadEvent 처리 실패", e);
        }
    }
}
