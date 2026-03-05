package com.minePing.BackEnd.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final String PREFIX = "refresh:";
    private final RedisTemplate<String, String> redisTemplate;

    public void saveRefreshToken(String publicUuid, String refreshToken, long expiration) {
        redisTemplate.opsForValue()
                     .set(PREFIX + publicUuid, refreshToken, expiration, TimeUnit.SECONDS);
    }

    public String getRefreshToken(String publicUuid) {
        return redisTemplate.opsForValue().get(PREFIX + publicUuid);
    }

    public void deleteRefreshToken(String publicUuid) {
        redisTemplate.delete(PREFIX + publicUuid);
    }
}
