package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(indexes = {@Index(name = "idx_company", columnList = "company_no")})
public class Member {
    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //pk값 자동생성(AUTO_INCREMENT방식)
    @Column(name = "user_no") //DB컬럼명 지정
    private Long userNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="company_no")
    private Company company;

    @Column(name="user_id", nullable = false, length = 50)
    private String userId;

    @Column(name="user_pwd", nullable = false)
    private String userPwd;

    @Column(name="name",nullable = false, length = 50)
    private String name;

    @Column(name="email",nullable = false, length = 100)
    private String email;

    @Column(name="gender",nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Gender gender;

    @Column(name="birthday",nullable = false)
    private LocalDate birthday;

    @Column(name="address",nullable = false, length = 100)
    private String address;

    @Column(name="phone",nullable = false, length = 13)
    private String phone;

    @Column(name="role",nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Role role;

    @Column(name="department",length = 50)
    private String department;

    @Column(name="position",length = 30)
    private String position;

    @Column(name="create_at",nullable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name="update_at",nullable = false)
    private Timestamp updateAt;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private CommonEnums.Status status;

    @OneToMany(mappedBy = "member", orphanRemoval = false)
    @Builder.Default
    private List<WorcationPartner> worcationPartners = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorcationApplication> worcationApplications = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = false)
    @Builder.Default
    private List<Worcation> worcations = new ArrayList<>();

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private Health health;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Mental> mentals = new ArrayList<>();

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private MemberPreference memberPreferences;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        if (this.status == null){
            status = CommonEnums.Status.Y;
        }
    }
}
