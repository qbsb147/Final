package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

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

    @Column(name = "public_uuid", columnDefinition = "BINARY(16)")
    private UUID publicUuid;

    @CreationTimestamp
    @Column(name = "date_time")
    private LocalDateTime dateTime;

    @Column(name = "batch_in")
    private Long batchIn;

    @PrePersist
    protected void onCreate(){
        isRead = false;
    }
}
