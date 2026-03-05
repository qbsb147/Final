package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.ChatRoomDto;
import com.minePing.BackEnd.dto.PageResponse;
import com.minePing.BackEnd.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/worcation/{worcation_no}")
    public ResponseEntity<Void> addWorcation(@PathVariable Long worcation_no){
        chatService.addWorcation(worcation_no);
        return ResponseEntity.ok().build();
    }

    @GetMapping("list")
    public ResponseEntity<List<ChatRoomDto.Response>> getList(){
        return ResponseEntity.ok(chatService.getRoomList());
    }

    @GetMapping("/message/{room_no}")
    public ResponseEntity<PageResponse<MessageDto.Response>> getMessages(
            @PathVariable Long room_no,
            @PageableDefault(
                    size = 50,
                    sort = "message_no",
                    direction = Sort.Direction.DESC
            )Pageable pageable
            ){
        return ResponseEntity.ok(new PageResponse<>(chatService.getMessages(room_no, pageable)));
    }

    @GetMapping("/participants_count/{room_no}")
    public ResponseEntity<Integer> getParticipants_count(@PathVariable("room_no") Long room_no){
        return ResponseEntity.ok(chatService.getParticipantsCount(room_no));
    }
}
