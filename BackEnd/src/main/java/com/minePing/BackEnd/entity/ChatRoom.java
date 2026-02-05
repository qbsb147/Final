package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "separation", nullable = false, length = 10)
    private String separation;

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
        if(name == null){
            name = "채팅방";
        }
    }
}
