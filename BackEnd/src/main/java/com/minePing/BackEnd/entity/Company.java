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
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_no")
    private Long companyNo;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "business_id", nullable = false, length = 10)
    private String businessId;

    @Column(name = "licensee", nullable = false, length = 20)
    private String licensee;

    @Column(name = "open_date", nullable = false)
    private LocalDate openDate;

    @Column(name="address",nullable = false)
    private String address;

    @Column(name="email",nullable = false, length = 100)
    private String email;

    @Column(name="company_tel",nullable = false, length = 13)
    private String companyTel;

    @Column(name="status",nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;


    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorcationPartner> worcationPartners = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Member> members = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = LocalDateTime.now();
    }
}
