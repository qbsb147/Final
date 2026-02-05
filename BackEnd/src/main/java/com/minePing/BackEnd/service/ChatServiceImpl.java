package com.minePing.BackEnd.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.ChatMessageDto;
import com.minePing.BackEnd.dto.ChatReadDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.entity.*;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.event.ChatReadEventProducer;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.kafka.ChatKafkaProducer;
import com.minePing.BackEnd.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatServiceImpl implements ChatService{

    private final ChatRoomRepository chatRoomRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MessageReadStatusRepository messageReadStatusRepository;
    private final WorcationRepository worcationRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private static final String ONLINE_KEY_PREFIX = "ONLINE:";
    private final ChatKafkaProducer chatKafkaProducerImpl;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final ChatReadEventProducer chatReadEventProducer;
    private final String workerId;

    @Override
    @Transactional
    public void saveRoom(ChatRoomDto.Request chatRoomDto) {
        String userId = jwtTokenProvider.getUserIdFromToken(chatRoomDto.getToken());
        ChatRoom chatRoom = null;
        if(chatRoomDto.getRoom_no()==null) {
            chatRoomDto.setName(userId);
            chatRoom = chatRoomRepository.save(ChatRoomDto.Request.toEntity(chatRoomDto));
        }
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException());
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .member(member)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }

    @Override
    @Transactional
    public void saveMessage(Long roomNo, ChatMessageDto.Request chatMessageDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomNo)
                .orElseThrow(() -> new NotFoundException("해당 채팅방을 찾을 수 없습니다."));
        Member member = memberRepository.findById(chatMessageDto.getUser_no())
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
                        .workerId(workerId)
                        .build()
        ));
    }

    @Override
    public void readMessage(ChatReadDto.Request chatReadDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();
        messageReadStatusRepository
                .updateRead(chatReadDto.getRoom_no(), userId, workerId);
    }

    @Override
    @Transactional
    public void addWorcation(Long worcation_no) {
        Worcation worcation = worcationRepository.findById(worcation_no)
                .orElseThrow(() -> new NotFoundException("워케이션을 못 찾았습니다."));

        String userId = jwtTokenProvider.getUserIdFromToken();

        Member Requester = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserNotFoundException("요청자의 아이디를 찾지 못했습니다."));

        String roomName = worcation.getWorcationName() + Requester.getNickName();

        List<ChatRoom> existingRoom = chatRoomRepository.findByNameAndSeparation(roomName, "worcation");
        if (!existingRoom.isEmpty()) return;

        Member Responder = memberRepository.findByUserIdAndStatus(worcation.getMember().getUserId(), CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException("업체의 아이디를 찾지 못했습니다."));

        ChatRoom chatRoom = ChatRoom.builder()
                .isGroupChat(false)
                .name(roomName)
                .separation("worcation")
                .build();

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        System.out.println("savedChatRoom = " + savedChatRoom);

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

        String userId = jwtTokenProvider.getUserIdFromToken();

        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException());

        List<ChatParticipant> myChatParticipants = chatParticipantRepository.findAllByMember(member);

        List<ChatRoom> chatRooms = chatRoomRepository.findRoomList(myChatParticipants);

        List<ChatParticipant> otherChatParticipants = chatParticipantRepository.findAllByChatRoomsInBatches(chatRooms, member, 20);

        List<ChatParticipant> onlineChatParticipants = otherChatParticipants.stream()
                .filter(cp -> redisTemplate.hasKey(ONLINE_KEY_PREFIX + cp.getMember().getUserId()))
                .toList();

        List<Object[]> unreadCount = messageReadStatusRepository.countUnreadMessagesByUserId(userId);
        List<ChatMessage> lastMessages = chatMessageRepository.findLastMessages(chatRooms);

        otherChatParticipants
                .forEach(x->{
                        redisTemplate.opsForSet()
                                .add("user:" + x + ":subscribers", userId);
                });

        return ChatRoomDto.Response.toListDto(chatRooms, lastMessages, unreadCount, otherChatParticipants, onlineChatParticipants);
    }

    @Override
    @Transactional
    public Page<ChatMessageDto.Response> getMessages(Long roomNo, Pageable pageable) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomNo)
                .orElseThrow(() -> new NotFoundException("해당 채팅방을 찾을 수가 없습니다."));
        Page<ChatMessage> chatMessages = chatMessageRepository.findAllByChatRoom_RoomNo(roomNo, pageable);

        String userId = jwtTokenProvider.getUserIdFromToken();

//        스프링의 이벤트 발행을 통한 서비스 구현
//        applicationEventPublisher.publishEvent(new ChatEvent.ChatReadEvent(roomNo, userId));

//        redis를 통한 서비스 구현
//        chatReadEventProducer.sendReadEvent(roomNo, userId);

//        kafka + debezium(+kafka)를 통한 서비스 구현
        chatKafkaProducerImpl.sendChatReadEvent(new ChatEvent.ChatReadEvent(roomNo, userId));

//        debezium(+kafka)를 통한 서비스 구현
//        messageReadStatusRepository.updateRead(roomNo, userId, workerId);


        switch (chatRoom.getSeparation()) {
            case "worcation" -> {
                return ChatMessageDto.Response.toWorcationListDto(chatMessages);
            }
            case "company" -> {
                return ChatMessageDto.Response.toCompanyListDto(chatMessages);
            }
            default -> {
                return null;
            }
        }
    }

    @Override
    public void sessionOnline(String userId) {
        redisTemplate.opsForValue()
                .set(ONLINE_KEY_PREFIX+userId,"", Duration.ofSeconds(60));
    }

    @Override
    public void sessionOffline(String userId) {
        redisTemplate.delete(ONLINE_KEY_PREFIX + userId);
        chatKafkaProducerImpl.sendOffline(userId);
    }
}
