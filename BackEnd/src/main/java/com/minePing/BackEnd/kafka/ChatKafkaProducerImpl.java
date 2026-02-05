package com.minePing.BackEnd.kafka;

import com.minePing.BackEnd.event.ChatEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatKafkaProducerImpl implements ChatKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendOnline(String userId) {
        kafkaTemplate.send("user-status", "ONLINE|" + userId);
    }

    public void sendOffline(String userId){
        kafkaTemplate.send("user-status", "OFFLINE|" + userId);
    }

    public void sendChatReadEvent(ChatEvent.ChatReadEvent event) {
        kafkaTemplate.send("chat_read_event", event);
    }
}
