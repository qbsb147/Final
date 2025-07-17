package com.minePing.BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
@Table(name = "photo", indexes = {@Index(name = "idx_photo_worcation", columnList = "worcation_no")})
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_no")
    private Long photoNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worcation_no", nullable = false)
    private Worcation worcation;

    @Column(name = "change_name", length = 500, nullable = false)
    private String changeName;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
