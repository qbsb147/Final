package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.dto.HealthDto;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.HealthEnums;
import com.minePing.BackEnd.enums.HealthEnums.AlcoholConsumption;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(
        name = "health",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_no", columnNames = "user_no")
        }
)

public class Health {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_no")
    private Long healthNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false, unique = true)
    private Member member;

    @Column(name="weight",nullable = false)
    private Float weight;

    @Column(name="height",nullable = false)
    private Float height;

    @Column(name="bmi",nullable = false)
    private Float bmi;

    @Column(name = "alcohol_consumption", nullable = false)
    @Enumerated(EnumType.STRING)
    private AlcoholConsumption alcoholConsumption;

    @Column(name="blood_pressure", nullable = false, length = 7)
    private String bloodPressure;

    @Column(name="blood_sugar", nullable = false)
    private Float bloodSugar;

    @Column(name="health_condition", nullable = false, length = 14)
    private String healthCondition;

    @Column(name="cholesterol_level", nullable = false)
    private Integer cholesterolLevel;

    @Column(name="smoking_status", nullable = false, length = 10)
    private String smokingStatus;

    @Column(name="physical_activity", nullable = false)
    @Enumerated(EnumType.STRING)
    private HealthEnums.PhysicalActivity physicalActivity;

    @Column(name = "sleep_hours", nullable = false)
    private Double sleepHours;

    @Column(name="diet_type", nullable = false, length = 12)
    private String dietType;

    @Column(name = "update_date", nullable = false)
    private LocalDate updateDate;

    public void changeMember(Member member) {
        this.member = member;
        member.assignHealth(this);
    }

    public Health changeThis(HealthDto.Request healthDto) {
        this.weight = healthDto.getWeight();
        this.height = healthDto.getHeight();
        this.bmi = healthDto.getBmi();
        this.alcoholConsumption = healthDto.getAlcohol_consumption();
        this.bloodPressure = healthDto.getBlood_pressure();
        this.bloodSugar = healthDto.getBlood_sugar();
        this.healthCondition = healthDto.getHealth_condition();
        this.cholesterolLevel = healthDto.getCholesterol_level();
        this.smokingStatus = healthDto.getSmoking_status();
        this.physicalActivity = healthDto.getPhysical_activity();
        this.sleepHours = healthDto.getSleep_hours();
        this.dietType = healthDto.getDiet_type();
        return this;
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updateDate = LocalDate.now();
    }
}
