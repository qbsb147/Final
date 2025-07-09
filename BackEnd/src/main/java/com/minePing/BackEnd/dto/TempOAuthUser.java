package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.SocialType;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class TempOAuthUser {
    private String uuid;
    private String socialId;
    private String email;
    private String name;
    private SocialType socialType;
    private LocalDateTime expiresAt;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
