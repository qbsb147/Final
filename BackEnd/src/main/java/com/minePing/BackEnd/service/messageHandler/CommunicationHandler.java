package com.minePing.BackEnd.service.messageHandler;

import com.amazonaws.services.kms.model.NotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MessageReadStatus;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.SocketEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.handler.ChatRoomWebSocketHandler;
import com.minePing.BackEnd.handler.OnlineWebSocketHandler;
import com.minePing.BackEnd.repository.ChatMessageRepository;
import com.minePing.BackEnd.repository.ChatRoomRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.MessageReadStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CommunicationHandler implements MessageHandler {

    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final RedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final OnlineWebSocketHandler onlineWebSocketHandler;
    private final ChatRoomWebSocketHandler chatRoomWebSocketHandler;

    private void save(MessageDto.Request chatMessageDto){
        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageDto.getRoom_no())
                .orElseThrow(() -> new NotFoundException("해당 채팅방을 찾을 수 없습니다."));
        Member member = memberRepository.findByPublicUuidAndStatus(chatMessageDto.getPublic_uuid(), CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException());
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .member(member)
                .content(chatMessageDto.getContent())
                .build();
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        List<Member> members = memberRepository.findAllMemberByChatRoom(chatRoom, member);

        members.forEach(m -> messageReadStatusRepository.save(
                MessageReadStatus
                        .builder()
                        .member(m)
                        .chatRoom(chatRoom)
                        .chatMessage(savedMessage)
                        .publicUuid(m.getPublicUuid())
                        .build()
        ));
    }

    private void send(MessageDto.Request chatMessageDto) throws IOException {
        Set<String> subscribers = redisTemplate.opsForSet()
                .members("user:" + chatMessageDto.getPublic_uuid().toString() + ":subscribers");

        if (subscribers == null) return;

        Long roomNo = chatMessageDto.getRoom_no();

        Set<WebSocketSession> entrySessions = chatRoomWebSocketHandler.getRoomSesstions(roomNo);

        entrySessions.forEach(sub -> messageReadStatusRepository.markMessageRead(roomNo, (UUID) sub.getAttributes().get("publicUuid"), System.currentTimeMillis()));

        MessageDto.Message response = MessageDto.Message.builder()
                .type(SocketEnums.type.MESSAGE)
                .room_no(chatMessageDto.getRoom_no())
                .content(chatMessageDto.getContent())
                .message_no(chatMessageDto.getMessage_no())
                .unread_count((chatMessageDto.getOther_people_count()+1)-entrySessions.size())
                .build();

        String json = objectMapper.writeValueAsString(response);
        for (String subscriber : subscribers) {
            try {
                UUID subscriberUuid = UUID.fromString(subscriber);
                WebSocketSession subscriberSession = onlineWebSocketHandler.getSession(subscriberUuid);

                if (subscriberSession != null && subscriberSession.isOpen()) {
                    subscriberSession.sendMessage(
                            new TextMessage(json)
                    );
                }
            } catch (IllegalArgumentException ignored) {
                // 잘못된 UUID 문자열인 경우 무시
            }
        }
    }

    @Override
    public void handle(MessageDto.Request chatMessageDto) throws IOException {
        save(chatMessageDto);
        send(chatMessageDto);
    }

    @Override
    public SocketEnums.type getType() {
        return SocketEnums.type.MESSAGE;
    }
}
