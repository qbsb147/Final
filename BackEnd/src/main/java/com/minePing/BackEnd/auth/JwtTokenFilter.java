package com.minePing.BackEnd.auth;

import com.minePing.BackEnd.service.RefreshTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final Key SECRET_KEY;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final int accessTokenExpireSec;

    public JwtTokenFilter(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access_expiration_sec}") int accessTokenExpireSec,
            JwtTokenProvider jwtTokenProvider,
            RefreshTokenService refreshTokenService
                          ) {
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.accessTokenExpireSec = accessTokenExpireSec;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String accessToken = extractTokenFromCookie(request);

        if (accessToken != null) {
            try {
                Claims claims = parseToken(accessToken);
                setAuthentication(claims);
            } catch (ExpiredJwtException e) {
                log.warn("ACCESS TOKEN EXPIRED");

                Claims claims = e.getClaims();
                String publicUuid = claims.getSubject();
                Date expiration = claims.getExpiration();
                long now = System.currentTimeMillis();

                long gracePeriodMs = 10 * 60 * 1000;

                if (now - expiration.getTime() > gracePeriodMs) {
                    writeUnauthorized(response, "ACCESS_TOKEN_EXPIRED_TOO_LONG");
                    return;
                }

                // Redis에서 RefreshToken 가져오기 RefreshToken 유효성 검증
                String refreshToken = refreshTokenService.getRefreshToken(publicUuid);
                if (refreshToken == null||!jwtTokenProvider.validateRefreshToken(refreshToken)) {
                    writeUnauthorized(response, "REFRESH_TOKEN_EXPIRED");
                    return;
                }

                // 새 AccessToken 재발급
                String newAccessToken = jwtTokenProvider.recreateAccessToken(refreshToken);

                // 쿠키 갱신
                addAccessTokenCookie(response, newAccessToken);

                Claims newClaims = parseToken(newAccessToken);
                setAuthentication(newClaims);

            } catch (Exception e) {
                log.warn("INVALID ACCESS TOKEN");
                writeUnauthorized(response, "INVALID_TOKEN");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private void setAuthentication(Claims claims) {

        String role = (String) claims.get("role");

        List<GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + role));

        UserDetails userDetails =
                new User(claims.getSubject(), "", authorities);

        Authentication auth =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                );

        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setMaxAge(accessTokenExpireSec); // 1시간 (필요 시 수정)
        cookie.setSecure(false);   // 배포 시 true
        response.addCookie(cookie);
    }

    private void writeUnauthorized(HttpServletResponse response, String message)
            throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.getWriter().write(message);
    }
}
