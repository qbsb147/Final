package com.minePing.BackEnd.config;

import com.minePing.BackEnd.event.ChatEvent;
import org.apache.kafka.common.TopicPartition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.util.backoff.ExponentialBackOff;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {
//pull 방식
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaConsumerConfig(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChatEvent.ChatReadEvent> kafkaListenerContainerFactory(
            ConsumerFactory<String, ChatEvent.ChatReadEvent> consumerFactory
    ) {
        ConcurrentKafkaListenerContainerFactory<String, ChatEvent.ChatReadEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);

        // DLQ 처리용 Recoverer
        DeadLetterPublishingRecoverer recoverer =
                new DeadLetterPublishingRecoverer(kafkaTemplate, (r, e) ->
                        new TopicPartition("chat_read_event_dlq", r.partition()));

        // 재시도 정책: 5초 간격, 최대 3회
        FixedBackOff fixedBackOff = new FixedBackOff(5000L, 3);
//        ExponentialBackOff exponentialBackOff = new ExponentialBackOff(2000L, 2);

        // DefaultErrorHandler 생성 (재시도 + DLQ)
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(recoverer, fixedBackOff);

        // 처리 실패 로깅
        errorHandler.setRetryListeners((record, ex, deliveryAttempt) -> {
            System.err.println("메시지 처리 실패 (재시도 " + deliveryAttempt + "회): " + record + ", 예외: " + ex.getMessage());
        });

        factory.setCommonErrorHandler(errorHandler);

        return factory;
    }
}
