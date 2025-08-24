package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Approve;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "worcation_application",
        indexes = {
                @Index(name = "idx_worcation_start_end",
                        columnList = "worcation_no, approve, start_date, end_date")
        }
    )
public class WorcationApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "application_no", nullable = false)
    private Long applicationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="worcation_no", nullable = false)
    private Worcation worcation;

    @Enumerated(EnumType.STRING)
    @Column(name="approve", nullable = false)
    private CommonEnums.Approve approve;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @CreationTimestamp
    @Column(name = "create_at", nullable = false)
    private Timestamp createAt;

    @UpdateTimestamp
    @Column(name = "update_at", nullable = false)
    private Timestamp updateAt;

    @OneToOne(mappedBy = "worcationApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    @PrePersist
    protected void onCreate() {
        if(approve == null) {
            this.approve = Approve.W;
        }
    }

    public void assignReview(Review review) {
        this.review = review;
    }

    public void updatestatus(CommonEnums.Approve approve) {
        this.approve = approve;
    }

}
