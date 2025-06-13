package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "worcation_amenity",
        indexes = {@Index(name = "idx_worcation", columnList = "worcation_no")})
public class WorcationAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worc_amenity_no")
    private Long worcAmenityNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="worcation_no", nullable = false)
    private Worcation worcation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="amenity_no", nullable = false)
    private Amenity amenity;
}
