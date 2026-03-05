package com.minePing.BackEnd.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.event.ChatEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.util.backoff.ExponentialBackOff;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {
//pull 방식
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaConsumerConfig(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @Bean
    public ConsumerFactory<String, String> stringConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "chat_service");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }


    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaStringListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(stringConsumerFactory());

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
