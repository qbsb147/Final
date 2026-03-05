package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.enums.SocketEnums;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class MessageDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;
        private String content;
        private UUID public_uuid;
        private Long message_no;
        private Integer other_people_count;
        private SocketEnums.type type;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long message_no;
        private UUID public_uuid;
        private String name;
        private String nick_name;
        private String content;
        private Integer unread_count;
        private LocalDateTime date_time;

        private static MessageDto.Response toWorcationDto(MessageProjection chatMessage){
            return Response.builder()
                    .message_no(chatMessage.getMessage_no())
                    .public_uuid(chatMessage.getPublic_uuid())
                    .nick_name(chatMessage.getNick_name())
                    .content(chatMessage.getContent())
                    .unread_count(chatMessage.getUnread_count())
                    .date_time(chatMessage.getDate_time())
                    .build();
        }

        private static MessageDto.Response toCompanyDto(MessageProjection chatMessage){
            return Response.builder()
                    .message_no(chatMessage.getMessage_no())
                    .public_uuid(chatMessage.getPublic_uuid())
                    .name(chatMessage.getName())
                    .content(chatMessage.getContent())
                    .date_time(chatMessage.getDate_time())
                    .build();
        }

        public static Page<Response> toWorcationListDto(Page<MessageProjection> chatMessages){
            List<Response> content = chatMessages.stream()
                    .map(Response::toWorcationDto)
                    .toList();

            return new PageImpl<>(
                    content,
                    chatMessages.getPageable(),
                    chatMessages.getTotalElements()
            );
        }

        public static Page<MessageDto.Response> toCompanyListDto(Page<MessageProjection> chatMessages){
            List<Response> content = chatMessages.stream()
                    .map(MessageDto.Response::toCompanyDto)
                    .toList();
            return new PageImpl<>(
                    content,
                    chatMessages.getPageable(),
                    chatMessages.getTotalElements()
            );
        }
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Message {
        private String content;
        private SocketEnums.type type;
        private Long room_no;
        private Long message_no;
        private Integer unread_count;
    }
}