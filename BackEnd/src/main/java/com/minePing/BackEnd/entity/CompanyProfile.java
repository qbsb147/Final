package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "company_profile")
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_no")
    private Long profileNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_no", nullable = false)
    private Company company;

    @Column(name = "department", nullable = false, length = 50)
    private String department;

    @Column(name = "position", nullable = false, length = 30)
    private String position;

    @Column(name = "company_phone", nullable = false, length = 13)
    private String companyPhone;

    @Column(name = "company_email", nullable = false, length = 100)
    private String companyEmail;

    @Column(name = "approve", nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Approve approve;

    @PrePersist
    protected void onCreate() {
        if(this.approve == null) {
            this.approve = CommonEnums.Approve.N;
        }
    }
}
