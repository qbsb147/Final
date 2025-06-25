package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.HealthEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "health")
public class Health {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_no")
    private Long healthNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

    @Column(name="weight",nullable = false)
    private Float weight;

    @Column(name="height",nullable = false)
    private Float height;

    @Column(name="bmi",nullable = false)
    private Float bmi;

    @Column(name="blood_pressure", nullable = false)
    private String bloodPressure;

    @Column(name="blood_sugar", nullable = false)
    private Float bloodSugar;

    @Column(name="health_condition", nullable = false)
    @Enumerated(EnumType.STRING)
    private HealthEnums.HealthCondition healthCondition;

    @Column(name="cholesterol_level", nullable = false)
    private Integer cholesterolLevel;

    @Column(name="smoking_status", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private HealthEnums.SmokingStatus smokingStatus;

    @Column(name = "alcohol_consumption", nullable = false)
    @Enumerated(EnumType.STRING)
    private HealthEnums.AlcoholConsumption alcoholConsumption;

    @Column(name="physical_activity", nullable = false)
    @Enumerated(EnumType.STRING)
    private HealthEnums.PhysicalActivity physicalActivity;

    @Column(name = "sleep_hours", nullable = false)
    private Double sleepHours;

    @Column(name="diet_type", nullable = false)
//    @Enumerated(EnumType.STRING)
//    private HealthEnums.DietType dietType;
    private String DietType;

    @Column(name = "update_date", nullable = false)
    private LocalDate updateDate;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updateDate = LocalDate.now();
    }
}
