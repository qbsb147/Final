package com.minePing.BackEnd.auth;


import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.service.RefreshTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key SECRET_KEY;
    private final int accessTokenExpireSec;
    private final int refreshTokenExpireSec;
    private final MemberRepository memberRepository;
    private final RefreshTokenService refreshTokenService;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access_expiration_sec}") int accessTokenExpireSec,
            @Value("${jwt.refresh_expiration_sec}") int refreshTokenExpireSec,
            MemberRepository memberRepository,
            RefreshTokenService refreshTokenService) {
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpireSec = accessTokenExpireSec;
        this.refreshTokenExpireSec = refreshTokenExpireSec;
        this.memberRepository = memberRepository;
        this.refreshTokenService = refreshTokenService;
    }

    public String createAccessToken(String userId, CommonEnums.Role role) {
        Claims claims = Jwts.claims().setSubject(userId);
        claims.put("role", role);

        Date now = new Date();
        Date expire = new Date(now.getTime() + (accessTokenExpireSec * 1000L));

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expire)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(String userId) {
        Date now = new Date();
        Date expire = new Date(now.getTime() + (refreshTokenExpireSec * 1000L));

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expire)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims parseClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Refresh Token이 유효하고 Redis 저장 값과도 일치하는지 검증 */
    public boolean isRefreshTokenValid(String refreshToken) {
        try {
            Claims claims = parseClaims(refreshToken);
            String userId = claims.getSubject();

            String stored = refreshTokenService.getRefreshToken(userId);
            return stored != null && stored.equals(refreshToken);

        } catch (ExpiredJwtException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // --- 4. 재발급용 Access Token ---
    public String recreateAccessToken(String refreshToken) {

        if (!isRefreshTokenValid(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        Claims claims = parseClaims(refreshToken);
        String userId = claims.getSubject();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(()-> new UserNotFoundException());
        return createAccessToken(userId, member.getRole());
    }

    public String getUserIdFromToken() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    public String getUserIdFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public CommonEnums.Role getRoleFromToken() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .filter(roleStr -> Arrays.stream(CommonEnums.Role.values())
                        .anyMatch(r -> r.name().equals(roleStr)))
                .map(CommonEnums.Role::valueOf)
                .findFirst()
                .orElse(null);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            return false; // 만료
        } catch (Exception e) {
            return false; // 위조 or 잘못된 형식
        }
    }

    public boolean validateRefreshToken(String refreshToken) {
        return validateToken(refreshToken);
    }

}
