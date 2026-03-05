package com.minePing.BackEnd.event;

import com.minePing.BackEnd.repository.MessageReadStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatEventConsumer {

    private final RedisTemplate<String, String> redisTemplate;
    private final MessageReadStatusRepository messageReadStatusRepository;

    @Scheduled(fixedDelay = 1000)
    public void consume() {
        List<MapRecord<String, Object, Object>> messages =
                redisTemplate.opsForStream().read(
                        Consumer.from("group1", "consumer1"),
                        StreamReadOptions.empty().count(10),
                        StreamOffset.fromStart("chat_read_stream"));

        for (MapRecord<String, Object, Object> msg : messages) {
            try {
                Long roomNo = Long.valueOf((String) msg.getValue().get("roomNo"));
                String publicUuidStr = (String) msg.getValue().get("publicUuid");
                UUID publicUuid = UUID.fromString(publicUuidStr);

                // 처리
//                messageReadStatusRepository.markMessageRead(roomNo, publicUuid, );

                // ACK
                redisTemplate.opsForStream().acknowledge("chat_read_stream", "group1", msg.getId());
            } catch (Exception e) {
                // 실패 로그 기록 후 재시도 가능
            }
        }
    }

}
