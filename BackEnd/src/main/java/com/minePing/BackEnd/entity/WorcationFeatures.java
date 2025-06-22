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
    @OneToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "worcation_no", nullable = false)
    private Worcation worcation;

    @Column(name = "location_type")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.LocationType locationType;

    @Column(name = "dominant_color")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.DominantColor dominantColor;

    @Column(name = "space_mood")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.SpaceMood spaceMood;

    @Column(name = "best_for")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.BestFor bestFor;

    @Lob
    @Column(name = "activities")
    private String activities;

    @Column(name = "accommodation_type")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.AccommodationType accommodationType;
}
