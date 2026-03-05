package com.minePing.BackEnd.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageReadStatusDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.event.ChatEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

public interface ChatService {
    void consumeMessage(MessageDto.Request messageDto) throws IOException;
    void readMessage(MessageReadStatusDto.Request chatReadDto);
    void addWorcation(Long worcation_no);
    List<ChatRoomDto.Response> getRoomList();
    Page<MessageDto.Response> getMessages(Long room_no, Pageable pageable);
    void sessionStateChange(ChatEvent.UserStateEvent userStateEvent) throws IOException;
    void chatReadDebezium(String payload) throws IOException;

    Integer getParticipantsCount(Long room_no);
}
