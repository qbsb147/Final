package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.entity.ChatParticipant;
import com.minePing.BackEnd.entity.ChatRoom;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ChatRoomDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;
        private String name;
        private String token;

        public static ChatRoom toEntity(ChatRoomDto.Request chatRoomDto){
            return ChatRoom.builder()
                    .roomNo(chatRoomDto.getRoom_no())
                    .name(chatRoomDto.getName())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long room_no;
        private String name;
        private String last_message;
        private Boolean is_group_chat;
        private String separation;
        private LocalDateTime create_time;
        private Integer unread_count;
        private List<String> other_nick_names;
        private List<String> online_nick_names;

        public static List<Response> toListDto(List<ChatRoom> chatRooms, List<ChatMessage> chatMessages, List<Object[]> unreadCount, List<ChatParticipant> otherChatParticipants, List<ChatParticipant> onlineChatParticipants){
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

            Map<Long, List<String>> otherChatParticipantMap = otherChatParticipants.stream()
                    .collect(Collectors.groupingBy(
                            cp->cp.getChatRoom().getRoomNo(),
                            Collectors.mapping(cp ->
                                onlineChatParticipants.contains(cp.getMember().getUserId()) ?
                                            "online:"+cp.getMember().getUserId() + ":" + cp.getMember().getNickName() :
                                            "offline:"+ cp.getMember().getUserId() + ":" + cp.getMember().getNickName()
                                                    , Collectors.toList()
                                )
                            )
                    );

            Map<Long, List<String>> onlineChatParticipantMap = onlineChatParticipants.stream()
                    .collect(Collectors.groupingBy(
                            cp->cp.getChatRoom().getRoomNo(),
                            Collectors.mapping(cp -> "online:" + cp.getMember().getNickName(), Collectors.toList())
                            )
                    );

            List<Response> dtos = chatRooms.stream()
                    .map(room->{
                        ChatMessage lastMsg = lastMessageMap.get(room.getRoomNo());
                        Integer unread = unreadCountMap.getOrDefault(room.getRoomNo(), 0);
                        List<String> otherNickNames = otherChatParticipantMap.getOrDefault(room.getRoomNo(), new ArrayList<>());
                        List<String> onlineNickNames = onlineChatParticipantMap.getOrDefault(room.getRoomNo(), new ArrayList<>());

                        return Response.builder()
                                .room_no(room.getRoomNo())
                                .name(room.getName())
                                .last_message(lastMsg != null ? lastMsg.getContent() : null)
                                .is_group_chat(room.getIsGroupChat())
                                .separation(room.getSeparation())
                                .create_time(lastMsg != null ? lastMsg.getDate_time() : null)
                                .unread_count(unread)
                                .other_nick_names(otherNickNames)
                                .online_nick_names(onlineNickNames)
                                .build();
                    })
                    .toList();

            return dtos;
        }
    }
}