package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.WorcationEnums;
import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "worcation_features")
public class WorcationFeatures {

    @Id
    @Column(name = "worcation_no")
    private Long worcationNo;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worcation_no", nullable = false)
    private Worcation worcation;

    @Column(name = "location_type")
    private WorcationEnums.LocationType locationType;

    @Column(name = "dominant_color")
    private WorcationEnums.DominantColor dominantColor;

    @Column(name = "space_mood")
    private WorcationEnums.SpaceMood spaceMood;

    @Column(name = "besr_for")
    private WorcationEnums.BestFor besrFor;

    @Lob
    @Column(name = "activities")
    private String activities;

    @Column(name = "accommodation_type")
    private WorcationEnums.AccommodationType accommodationType;
}
