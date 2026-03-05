package com.minePing.BackEnd.event;

import com.minePing.BackEnd.repository.MessageReadStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatEventListener {

    private final MessageReadStatusRepository messageReadStatusRepository;

    private static final int MAX_RETRY = 3;
    private final String workerId;

    @Async
    @EventListener
    public void handleChatReadEvent(ChatEvent.ChatReadEvent event) {

        int retryCount = 0;
        long waitTime = 1000L;

        while(retryCount < MAX_RETRY){
            try {
//                messageReadStatusRepository
//                        .markMessageRead(event.roomNo(), event.publicUuid(), );

                log.info("읽음 처리 완료: room={}, user={}", event.roomNo(), event.publicUuid());
                return;
            } catch (Exception e) {
                retryCount++;
                log.error("읽음 처리 실패: room={}, user={}", event.roomNo(), event.publicUuid(), e);
                if(retryCount < MAX_RETRY){
                    try {
                        Thread.sleep(waitTime);
                        waitTime *=2;
                    }catch (InterruptedException ex){
                        Thread.currentThread().interrupt();
                        log.error("재시도 대기 중 인터럽트 발생", ex);
                        return;
                    }
                }
            }
        }
    }
}
