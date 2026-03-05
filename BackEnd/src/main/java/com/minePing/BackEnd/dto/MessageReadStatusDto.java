package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.SocketEnums;
import lombok.*;

import java.util.UUID;

public class MessageReadStatusDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;
        private UUID public_uuid;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long room_no;
        private Long message_no;
        private UUID public_uuid;
        private SocketEnums.type type;
    }
}