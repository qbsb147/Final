package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "message_read_status")
public class MessageReadStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "read_no")
    private Long readNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_no", nullable = false)
    private ChatMessage chatMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "room_no", nullable = false)
    private ChatRoom chatRoom;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "worker_id", length = 4)
    private String workerId;

    @CreationTimestamp
    @Column(name = "date_time")
    private LocalDateTime dateTime;

    @PrePersist
    protected void onCreate(){
        isRead = false;
    }

    public void changeReference(ChatMessage chatMessage, Member member, ChatRoom chatRoom){
        this.chatMessage = chatMessage;
        this.member = member;
        this.chatRoom = chatRoom;
        if(!chatMessage.getMessageReadStatuses().contains(this)){
            chatMessage.getMessageReadStatuses().add(this);
        }
        if(!member.getMessageReadStatuses().contains(this)){
            member.getMessageReadStatuses().add(this);
        }
        if(!chatRoom.getMessageReadStatuses().contains(this)){
            chatRoom.getMessageReadStatuses().add(this);
        }
    }
}
