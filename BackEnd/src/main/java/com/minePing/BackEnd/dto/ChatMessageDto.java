package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.ChatMessage;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.List;

public class ChatMessageDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long room_no;
        private Long user_no;
        private String content;
        private String nick_name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long message_no;
        private String nick_name;
        private String name;
        private String content;
        private LocalDateTime date_time;

        private static ChatMessageDto.Response toWorcationDto(ChatMessage chatMessage){
            return ChatMessageDto.Response.builder()
                    .message_no(chatMessage.getMessageNo())
                    .nick_name(chatMessage.getMember().getNickName())
                    .content(chatMessage.getContent())
                    .date_time(chatMessage.getDate_time())
                    .build();
        }

        private static ChatMessageDto.Response toCompanyDto(ChatMessage chatMessage){
            return ChatMessageDto.Response.builder()
                    .message_no(chatMessage.getMessageNo())
                    .nick_name(chatMessage.getMember().getNickName())
                    .content(chatMessage.getContent())
                    .date_time(chatMessage.getDate_time())
                    .build();
        }

        public static Page<Response> toWorcationListDto(Page<ChatMessage> chatMessages){
            List<Response> content = chatMessages.stream()
                    .map(Response::toWorcationDto)
                    .toList();

            return new PageImpl<>(
                    content,
                    chatMessages.getPageable(),
                    chatMessages.getTotalElements()
            );
        }

        public static Page<ChatMessageDto.Response> toCompanyListDto(Page<ChatMessage> chatMessages){
            List<Response> content = chatMessages.stream()
                    .map(ChatMessageDto.Response::toCompanyDto)
                    .toList();
            return new PageImpl<>(
                    content,
                    chatMessages.getPageable(),
                    chatMessages.getTotalElements()
            );
        }
    }
}