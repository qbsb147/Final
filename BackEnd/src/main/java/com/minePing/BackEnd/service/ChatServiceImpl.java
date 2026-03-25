package com.minePing.BackEnd.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageProjection;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.entity.*;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.SocketEnums;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.event.ChatEventProducer;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.handler.ChatRoomWebSocketHandler;
import com.minePing.BackEnd.kafka.ChatKafkaProducer;
import com.minePing.BackEnd.repository.*;
import com.minePing.BackEnd.service.messageHandler.MessageFactory;
import com.minePing.BackEnd.service.messageHandler.MessageHandler;
import com.minePing.BackEnd.service.userStateHandler.UserStateFactory;
import com.minePing.BackEnd.service.userStateHandler.UserStateHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.minePing.BackEnd.redis.RedisKeys.ONLINE_KEY_PREFIX;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ChatServiceImpl implements ChatService{

    private final ChatRoomRepository chatRoomRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final WorcationRepository worcationRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ChatKafkaProducer chatKafkaProducer;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final ChatEventProducer chatEventProducer;
    private final ObjectMapper objectMapper;
    private final UserStateFactory userStateFactory;
    private final ChatRoomWebSocketHandler chatRoomWebSocketHandler;
    private final MessageFactory messageFactory;

    @Override
    @Transactional
    public void consumeMessage(MessageDto.Request messageDto) throws IOException {
        MessageHandler messageHandler = messageFactory.getHandler(messageDto.getType());
        messageHandler.handle(messageDto);
    }

    @Override
    @Transactional
    public void readMessage(MessageReadStatusDto.Request messageReadStatusDto) {
        try {
            messageReadStatusRepository.markMessageRead(messageReadStatusDto.getRoom_no(), messageReadStatusDto.getPublic_uuid(), System.currentTimeMillis());
        } catch (Exception e) {
            // Kafka Retry 정책에 따라 재처리될 수 있음
            log.error("ChatReadEvent 처리 실패 → 재시도 예정", e);
            throw e; // 예외를 던져야 Kafka가 재시도함
        }
    }

    @Override
    @Transactional
    public void addWorcation(Long worcation_no) {
        Worcation worcation = worcationRepository.findById(worcation_no)
                .orElseThrow(() -> new NotFoundException("워케이션을 못 찾았습니다."));

        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();

        Member Requester = memberRepository.findByPublicUuidAndStatus(publicUuid, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException("요청자의 아이디를 찾지 못했습니다."));

        String roomName = worcation.getWorcationName();

        List<ChatRoom> existingRoom = chatRoomRepository.findByRoomNameAndSeparation(roomName, "worcation");
        if (!existingRoom.isEmpty()) return;

        Member Responder = memberRepository.findByPublicUuidAndStatus(worcation.getMember().getPublicUuid(), CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException("업체의 아이디를 찾지 못했습니다."));

        ChatRoom chatRoom = ChatRoom.builder()
                .isGroupChat(false)
                .roomName(roomName)
                .ownerUuid(publicUuid)
                .separation("worcation")
                .build();

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        ChatParticipant RequestParticipant = ChatParticipant.builder()
                .member(Requester)
                .chatRoom(savedChatRoom)
                .build();
        ChatParticipant ResponseParticipant = ChatParticipant.builder()
                .member(Responder)
                .chatRoom(savedChatRoom)
                .build();

        chatParticipantRepository.save(RequestParticipant);
        chatParticipantRepository.save(ResponseParticipant);
    }

    @Override
    public List<ChatRoomDto.Response> getRoomList() {

        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();

        Member currentMember = memberRepository.findByPublicUuidAndStatus(publicUuid, CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException());

        List<ChatParticipant> myChatParticipants = chatParticipantRepository.findAllByMember(currentMember);

        List<ChatRoom> chatRooms = chatRoomRepository.findRoomList(myChatParticipants);

        List<UUID> ownerUuidList = chatRooms.stream().map(ChatRoom::getOwnerUuid).toList();

        List<Member> owners = memberRepository.findByPublicUuidIn(ownerUuidList);

        List<ChatParticipant> otherChatParticipants = chatParticipantRepository.findAllByChatRoomsInBatches(chatRooms, currentMember, 20);

        Set<UUID> onlineChatParticipantUUIDList = otherChatParticipants.stream()
                .filter(cp -> redisTemplate.hasKey(ONLINE_KEY_PREFIX + cp.getMember().getPublicUuid().toString()))
                .map(cp -> cp.getMember().getPublicUuid())
                .collect(Collectors.toSet());

        List<Object[]> unreadCount = messageReadStatusRepository.countUnreadMessagesByPublicUuid(publicUuid);
        List<ChatMessage> lastMessages = chatMessageRepository.findLastMessages(chatRooms);

        otherChatParticipants
                .forEach(x->{
                        redisTemplate.opsForSet()
                                .add("user:" + x.getMember().getPublicUuid().toString() + ":subscribers", publicUuid.toString());
                });

        return ChatRoomDto.Response.toListDto(chatRooms, lastMessages, unreadCount, otherChatParticipants, onlineChatParticipantUUIDList, owners);
    }

    @Override
    public Page<MessageDto.Response> getMessages(Long roomNo, Pageable pageable) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomNo)
                .orElseThrow(() -> new NotFoundException("해당 채팅방을 찾을 수가 없습니다."));
        Page<MessageProjection> chatMessages = chatMessageRepository.findMessagesWithUnreadAndMember(roomNo, pageable);

        UUID publicUuid = jwtTokenProvider.getPublicUuidFromToken();
//        스프링의 이벤트 발행을 통한 서비스 구현
//        applicationEventPublisher.publishEvent(new ChatEvent.ChatReadEvent(roomNo, publicUuid));

//        redis를 통한 서비스 구현
//        chatEventProducer.sendReadEvent(roomNo, publicUuid);

//        kafka + debezium(+kafka)를 통한 서비스 구현
        chatKafkaProducer.sendChatReadEvent(MessageReadStatusDto.Request.builder()
                .room_no(roomNo)
                .public_uuid(publicUuid)
                .build()
        );

//        debezium(+kafka)를 통한 서비스 구현
//        messageReadStatusRepository.updateRead(roomNo, publicUuid, workerId);

        switch (chatRoom.getSeparation()) {
            case "worcation" -> {
                return MessageDto.Response.toWorcationListDto(chatMessages);
            }
            case "company" -> {
                return MessageDto.Response.toCompanyListDto(chatMessages);
            }
            default -> {
                return null;
            }
        }
    }

    @Override
    public void sessionStateChange(ChatEvent.UserStateEvent userStateEvent) throws IOException {
        UserStateHandler userStateHandler = userStateFactory.getHandler(userStateEvent.status());
        UUID publicUuid = userStateEvent.publicUuid();
        userStateHandler.handle(publicUuid);
        userStateHandler.broadCast(publicUuid);
    }

    public void chatReadDebezium(String payload) throws IOException {
        JsonNode root = objectMapper.readTree(payload);

        String op = root.get("op").asText(); // u, c, d
        if (!"u".equals(op)) return; // update 이벤트만 처리

        JsonNode after = root.path("after");
        if (after.isMissingNode() || after.isNull()) {
            log.warn("after is null. payload={}", payload);
            return;
        }
        Long roomNo = after.path("room_no").asLong();
        Long messageNo = after.path("message_no").asLong();
        String uuidStr = after.path("public_uuid").asText();
        if (uuidStr == null) {
            log.warn("public_uuid null. payload={}", payload);
            return;
        }
        byte[] bytes = Base64.getDecoder().decode(uuidStr);
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        UUID publicUuid = new UUID(bb.getLong(), bb.getLong());
        boolean isRead = after.path("is_read").asBoolean(false);
        JsonNode batchNode = after.get("batch_in");
        if (batchNode == null || batchNode.isNull()) return;

        Long batchIn = batchNode.asLong();

        if(!isRead) return;

        String idempotentKey = String.valueOf(batchIn);

        Boolean firstProcess = redisTemplate.opsForValue()
                .setIfAbsent(idempotentKey, "", Duration.ofHours(1));

        if(Boolean.TRUE.equals(firstProcess)){
            MessageReadStatusDto.Response messageReadStatusDto = MessageReadStatusDto.Response.builder()
                    .room_no(roomNo)
                    .message_no(messageNo)
                    .public_uuid(publicUuid)
                    .type(SocketEnums.type.READ)
                    .build();
            Set<WebSocketSession> sessions = chatRoomWebSocketHandler.getRoomSesstions(roomNo);
            for(WebSocketSession session : sessions) {
                if (session != null && session.isOpen()) {
                    String json = objectMapper.writeValueAsString(messageReadStatusDto);
                    session.sendMessage(new TextMessage(json));
                }
            }
        }
    }

    @Override
    public Integer getParticipantsCount(Long room_no) {
        return chatRoomWebSocketHandler.getRoomSesstions(room_no).size();
    }
}
