package com.minePing.BackEnd.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
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

    //JWT를 생성하거나 검증할 때 사용하는 진짜 key객체
    private final Key SECRET_KEY;
    // application.yml에 설정된 jwt 시크릿 키 주입
    private final String secretKey;

    public JwtTokenFilter(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    //JWT토근 검증
    //검증이 필요한 모든 요청에 대해서 실행하는 필터, Authorization 헤더에 포함된 JWT를 검증
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String token = httpRequest.getHeader("Authorization");
        try {
            if (token != null) {
                if (!token.startsWith("Bearer ")) {
                    throw new AuthenticationServiceException("Bearer 형식이 아닙니다.");
                }

                //Bearer 뒤에 담긴 실제 jwt문자열 추출
                String jwtToken = token.substring(7);

                //jwt토큰 파싱하고 서명 검증
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(SECRET_KEY) //Key객체로 검증
                        .build()
                        .parseClaimsJws(jwtToken)
                        .getBody(); // Claims(payload) 반환

                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + claims.get("role")));

                //jwt의 subject값을 username으로 사용하겠다.
                UserDetails userDetails = new User(claims.getSubject(), "", authorities);
                //인증객체 생성(사용자정보, 인증수단, 권한리스트)
                Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, jwtToken,
                        userDetails.getAuthorities());

                //현재 요청에 대한 인증 정보 등록
                //이요청을 인증된 것으로 간주
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
