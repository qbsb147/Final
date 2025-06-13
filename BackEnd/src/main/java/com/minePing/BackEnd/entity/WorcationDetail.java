package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "worcation_detail")
public class WorcationDetail {

    @Id
    @Column(name = "worcation_no")
    private Long worcationNo;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worcation_no", nullable = false)
    private Worcation worcation;

    @Column(name="licensee", length=20, nullable = false)
    private String licensee;

    @Column(name="business_id", length=10, nullable = false)
    private String businessId;

    @Column(name="worcation_tel", length=13)
    private String worcationTel;

    @Column(name="charge_amount")
    private Integer chargeAmount;

    @Lob
    @Column(name="content")
    private String content;

    @Lob
    @Column(name="navigate")
    private String navigate;

    @Column(name="available_time", length=100)
    private String availableTime;

    @Lob
    @Column(name="refund_policy")
    private String refundPolicy;

    @Column(name="open_date", nullable = false)
    private LocalDate openDate;
}
