package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "sigg_areas")
public class SiggAreas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer Id;

    @Column(name="name",nullable = false,length = 50)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sido_area_id", nullable = false)
    private SidoAreas sidoAreas;

    @OneToMany(mappedBy = "siggAreas")
    @Builder.Default
    private List<Worcation> worcations = new ArrayList<>();
}
