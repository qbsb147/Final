package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.ChatRoom;
import lombok.*;

public class ChatReadDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;

        public static ChatRoom toEntity(ChatReadDto.Request chatRoomDto){
            return ChatRoom.builder()
                    .roomNo(chatRoomDto.getRoom_no())
                    .build();
        }
    }
}