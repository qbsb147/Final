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
@Table(name = "sido_areas")
public class SidoAreas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer Id;

    @Column(name="name",nullable = false,length = 50)
    private String name;

    @OneToMany(mappedBy = "sidoAreas")
    @Builder.Default
    private List<SiggAreas> siggAreasList = new ArrayList<>();
}
