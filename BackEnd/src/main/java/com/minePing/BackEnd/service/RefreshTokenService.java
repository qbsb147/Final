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

    public void saveRefreshToken(String userId, String refreshToken, long expiration) {
        redisTemplate.opsForValue()
                     .set(PREFIX + userId, refreshToken, expiration, TimeUnit.SECONDS);
    }

    public String getRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(PREFIX + userId);
    }

    public void deleteRefreshToken(String userId) {
        redisTemplate.delete(PREFIX + userId);
    }
}
