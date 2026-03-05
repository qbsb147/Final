package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.entity.ChatParticipant;
import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.MemberEnums;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ChatRoomDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;
        private String room_name;
        private String token;

        public static ChatRoom toEntity(Request chatRoomDto){
            return ChatRoom.builder()
                    .roomNo(chatRoomDto.getRoom_no())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Participant {
        private MemberEnums.Status status;
        private UUID public_uuid;
        private String nick_name;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long room_no;
        private String room_name;
        private String owner_nick_name;
        private String last_message;
        private Boolean is_group_chat;
        private String separation;
        private LocalDateTime create_time;
        private Integer unread_count;
        private List<Participant> other_participants;

        public static List<Response> toListDto(List<ChatRoom> chatRooms, List<ChatMessage> chatMessages, List<Object[]> unreadCount, List<ChatParticipant> otherChatParticipants, Set<UUID> onlineChatParticipantUUIDList, List<Member> owners){
            Map<Long, ChatMessage> lastMessageMap = chatMessages.stream()
                    .collect(Collectors.toMap(
                            msg -> msg.getChatRoom().getRoomNo(),
                            msg -> msg
                    ));

            Map<Long, Integer> unreadCountMap = unreadCount.stream()
                    .collect(Collectors.toMap(
                            row -> (Long) row[0],
                            row -> ((Number) row[1]).intValue()
                    ));

            Map<Long, List<Participant>> otherChatParticipantMap = otherChatParticipants.stream()
                    .collect(Collectors.groupingBy(
                            cp->cp.getChatRoom().getRoomNo(),
                            Collectors.mapping(cp ->
                                onlineChatParticipantUUIDList.contains(cp.getMember().getPublicUuid()) ?
                                        Participant.builder().status(MemberEnums.Status.Online)
                                                .public_uuid(cp.getMember().getPublicUuid())
                                                .nick_name(cp.getMember().getNickName())
                                                .build()
                                        :
                                        Participant.builder().status(MemberEnums.Status.Offline)
                                                .public_uuid(cp.getMember().getPublicUuid())
                                                .nick_name(cp.getMember().getNickName())
                                                .build(),
                                    Collectors.toList()
                                )
                            )
                    );

            Map<UUID, Member> ownerMap = owners.stream().collect(Collectors.toMap(Member::getPublicUuid, Function.identity()));

            List<Response> dtos = chatRooms.stream()
                    .map(room->{
                        ChatMessage lastMsg = lastMessageMap.get(room.getRoomNo());
                        Integer unread = unreadCountMap.getOrDefault(room.getRoomNo(), 0);
                        List<Participant> otherParticipants = otherChatParticipantMap.getOrDefault(room.getRoomNo(), new ArrayList<>());

                        return Response.builder()
                                .room_no(room.getRoomNo())
                                .room_name(room.getRoomName())
                                .owner_nick_name(ownerMap.get(room.getOwnerUuid()).getNickName())
                                .last_message(lastMsg != null ? lastMsg.getContent() : null)
                                .is_group_chat(room.getIsGroupChat())
                                .separation(room.getSeparation())
                                .create_time(lastMsg != null ? lastMsg.getDate_time() : null)
                                .unread_count(unread)
                                .other_participants(otherParticipants)
                                .build();
                    })
                    .toList();

            return dtos;
        }
    }
}