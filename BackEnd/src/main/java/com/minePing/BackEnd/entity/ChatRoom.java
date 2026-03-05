package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "chat_room")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="room_no")
    private Long roomNo;

    @Column(name = "isGroupChat", nullable = false)
    private Boolean isGroupChat;

    @Column(name = "room_name", nullable = false, length = 100)
    private String roomName;

    @Column(name = "separation", nullable = false, length = 10)
    private String separation;

    @Column(name = "owner_uuid", nullable = false, columnDefinition = "BINARY(16)" )
    private UUID ownerUuid;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @Builder.Default
    private List<MessageReadStatus> messageReadStatuses = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ChatMessage> chatMessages = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ChatParticipant> chatParticipants = new ArrayList<>();

    @PrePersist
    protected void OnCreate(){
        if(roomName == null){
            roomName = "채팅방";
        }
    }
}
