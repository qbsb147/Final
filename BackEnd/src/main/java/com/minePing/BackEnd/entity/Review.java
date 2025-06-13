package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_no")
    private Long reviewNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_no", nullable = false)
    private WorcationApplication worcationApplication;

    @Column(name = "writer_id",nullable = false,length = 30)
    private String writerId;

    @Lob
    @Column(name="review_content", nullable = false)
    private String reviewContent;

    @Column(name="create_at",nullable = false)
    private LocalDateTime createAt;

    @Column(name="update_at",nullable = false)
    private LocalDateTime updateAt;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
