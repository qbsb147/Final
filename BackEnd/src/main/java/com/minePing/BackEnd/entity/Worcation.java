package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.WorcationEnums;
import jakarta.persistence.*;
import lombok.*;

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
public class Worcation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worcation_no")
    private Long worcationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="ref_writer", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ref_area_id")
    private SiggAreas siggAreas;

    @Column(name = "worcation_name",nullable = false,length = 50)
    private String worcationName;

    @Column(name = "worcation_category",nullable = false)
    @Enumerated(EnumType.STRING)
    private WorcationEnums.Category worcationCategory;

    @Column(name = "main_change_photo",length = 100)
    private String mainChangePhoto;

    @Column(name = "worcation_thema",length = 20)
    private String worcationThema;

    @Column(name = "max_people")
    private Integer maxPeople;

    @Column(name = "partner_price")
    private String partnerPrice;

    @Lob
    @Column(name = "non_partner_price")
    private Integer nonPartnerPrice;

    @Column(name = "address",length = 100)
    private String address;

    @Column(name = "update_at",nullable = false)
    private LocalDateTime updateAt;

    @Column(name = "create_at",nullable = false)
    private LocalDateTime createAt;

    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @OneToMany(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorcationAmenity> worcationAmenities = new ArrayList<>();

    @OneToMany(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Photo> photos = new ArrayList<>();

    @OneToMany(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorcationApplication> worcationApplications = new ArrayList<>();

    @OneToMany(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorcationPartner> worcationPartners = new ArrayList<>();

    @OneToOne(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    private WorcationDetail worcationDetail;

    @OneToOne(mappedBy = "worcation", cascade = CascadeType.ALL, orphanRemoval = true)
    private WorcationFeatures worcationFeatures;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        if(status == null){
            status = CommonEnums.Status.Y;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
