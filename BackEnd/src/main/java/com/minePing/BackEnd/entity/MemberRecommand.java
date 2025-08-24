package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.dto.MemberPreferenceDto;
import com.minePing.BackEnd.enums.PreferenceEnums;
import com.minePing.BackEnd.enums.WorcationEnums;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity

@Table(name = "member_recommand")
@EntityListeners(AuditingEntityListener.class)
public class MemberRecommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommand_no")
    private Long recommandNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private Member member;

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

    @Column(name = "accommodation_type")
    @Enumerated(EnumType.STRING)
    private WorcationEnums.AccommodationType accommodationType;

    @CreatedDate
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;

    public void changeMember(Member member) {
        this.member = member;
    }

    public void dominantColorIsNull() {
        this.dominantColor = null;
    }

    public void spaceMoodIsNull() {
        this.spaceMood = null;
    }

    public void bestForIsNull() {
        this.bestFor = null;
    }

    public void accommodationTypeIsNull() {
        this.accommodationType = null;
    }
}
