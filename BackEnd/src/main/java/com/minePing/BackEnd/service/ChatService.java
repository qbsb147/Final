package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.ChatMessageDto;
import com.minePing.BackEnd.dto.ChatReadDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService {
    void saveMessage(Long roomNo, ChatMessageDto.Request chatMessageDto);
    void saveRoom(ChatRoomDto.Request chatRoomDto);
    void readMessage(ChatReadDto.Request chatReadDto);
    void addWorcation(Long worcation_no);
    List<ChatRoomDto.Response> getRoomList();
    Page<ChatMessageDto.Response> getMessages(Long room_no, Pageable pageable);
    void sessionOnline(String userId);
    void sessionOffline(String userId);
}
