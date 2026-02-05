package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="message_no")
    private Long messageNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_no", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

    @Column(name="content")
    @Lob
    private String content;

    @Column(name = "date_time")
    @CreationTimestamp
    private LocalDateTime date_time;

    @OneToMany(mappedBy = "chatMessage", cascade = CascadeType.ALL)
    @Builder.Default
    private List<MessageReadStatus> messageReadStatuses = new ArrayList<>();

    public void changeMember(Member member){
        if(!member.getChatMessages().contains(this))
            member.getChatMessages().add(this);
    }
}
