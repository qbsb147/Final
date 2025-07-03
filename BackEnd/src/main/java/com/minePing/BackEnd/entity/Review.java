package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity

@Table(
        name = "review",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_application_no",
                        columnNames = "application_no"
                )
        }
)

public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_no")
    private Long reviewNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_no", nullable = false, unique = true)
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

    /**
     * 리뷰 내용 변경 (비즈니스 의미 메서드)
     */
    public void changeContent(String newContent) {
        if (newContent == null || newContent.isBlank()) throw new IllegalArgumentException("리뷰 내용은 비어 있을 수 없습니다.");
        this.reviewContent = newContent;
        // updateAt은 @PreUpdate로 자동 갱신
    }
}
