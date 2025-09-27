package com.minePing.BackEnd.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class JwtTokenFilter extends GenericFilter {

    private final Key SECRET_KEY;
    private final String secretKey;

    public JwtTokenFilter(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Session Cookie에서만 토큰 읽기
        String token = null;
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        try {
            if (token != null) {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(SECRET_KEY)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + claims.get("role")));

                UserDetails userDetails = new User(claims.getSubject(), "", authorities);
                Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, token,
                        userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(auth);
            }

            chain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();

            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("invalid token");
        }
    }
}
