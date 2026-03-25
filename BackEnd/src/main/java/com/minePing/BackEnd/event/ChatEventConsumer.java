package com.minePing.BackEnd.event;

import com.minePing.BackEnd.repository.MessageReadStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Range;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatEventConsumer {
    private final RedisTemplate<String, String> redisTemplate;
    private final MessageReadStatusRepository messageReadStatusRepository;

    private static final String STREAM_KEY = "chat_read_stream";
    private static final String GROUP = "group1";
    private static final String CONSUMER = "consumer1";
    private static final int BATCH_SIZE = 10;

    @Scheduled(fixedDelay = 1000)
    public void consume() {
        // 1️⃣ Pending 메시지 먼저 처리 (재처리)
        PendingMessagesSummary pending = redisTemplate.opsForStream().pending(STREAM_KEY, GROUP);

        // Pending 메시지별 처리
        pending.getPendingMessagesPerConsumer().forEach((consumer, msgId) -> {
            // msgId는 Long 하나
            List<MapRecord<String, Object, Object>> records =
                    redisTemplate.opsForStream()
                            .range(STREAM_KEY, Range.closed(msgId.toString(), msgId.toString()));

                // records 처리
                processMessages(records);
        });
        // 2️⃣ 새로 들어온 메시지 읽기
        List<MapRecord<String, Object, Object>> newMessages =
                redisTemplate.opsForStream().read(
                        Consumer.from(GROUP, CONSUMER),
                        StreamReadOptions.empty().count(BATCH_SIZE),
                        StreamOffset.fromStart(STREAM_KEY));

        processMessages(newMessages);
    }

    private void processMessages(List<MapRecord<String, Object, Object>> messages) {
        for (MapRecord<String, Object, Object> msg : messages) {
            try {
                Long roomNo = Long.valueOf((String) msg.getValue().get("roomNo"));
                UUID publicUuid = UUID.fromString((String) msg.getValue().get("publicUuid"));

                // 읽음 처리
                messageReadStatusRepository.markMessageRead(roomNo, publicUuid);

                // ACK: 처리 완료 표시
                redisTemplate.opsForStream().acknowledge(STREAM_KEY, GROUP, msg.getId());

            } catch (Exception e) {
                // 실패 로그 기록, 다음 스케줄에서 Pending으로 재처리
                log.error("읽음 처리 실패, 재시도 예정: msgId={}, error={}", msg.getId(), e.getMessage());
            }
        }
    }
}
