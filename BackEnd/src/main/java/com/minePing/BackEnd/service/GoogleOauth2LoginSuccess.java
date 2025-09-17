package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.TempOAuthUser;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.SocialType;
import com.minePing.BackEnd.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class GoogleOauth2LoginSuccess extends SimpleUrlAuthenticationSuccessHandler {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final TempOAuthUserStore tempOAuthUserStore;

    public GoogleOauth2LoginSuccess(MemberRepository memberRepository, JwtTokenProvider jwtTokenProvider, TempOAuthUserStore tempOAuthUserStore) {
        this.memberRepository = memberRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tempOAuthUserStore = tempOAuthUserStore;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String openId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");

        Member member = memberRepository.findBySocialIdAndStatus(openId, CommonEnums.Status.Y)
                .orElse(null);
        if (member == null) {
            String uuid = UUID.randomUUID().toString();
            TempOAuthUser tempUser = TempOAuthUser
                    .builder()
                    .uuid(uuid)
                    .email(email)
                    .socialId(openId)
                    .name(oAuth2User.getAttribute("name"))
                    .socialType(SocialType.GOOGLE)
                    .expiresAt(LocalDateTime.now().plusHours(2))
                    .build();
            tempOAuthUserStore.save(uuid, tempUser);

            String jwtToken = jwtTokenProvider.createToken(uuid, CommonEnums.Role.TEMP);

            response.addHeader("Set-Cookie", String.format(
                    "token=%s; Path=/; HttpOnly; Secure=true; SameSite=Lax",
                    jwtToken
            ));

/*
            Cookie jwtCookie = new Cookie("token", jwtToken);
            jwtCookie.setPath("/");
            response.addCookie(jwtCookie);
            */

            response.sendRedirect("http://localhost:5173/signUp");
//            response.sendRedirect("https://mineping.store/signUp");
            return;
        }

        String jwtToken = jwtTokenProvider.createToken(member.getUserId(), member.getRole());
        
        response.addHeader("Set-Cookie", String.format(
                "token=%s; Path=/; HttpOnly; Secure=true; SameSite=Lax",
                jwtToken
        ));
        response.sendRedirect("http://localhost:5173");
//        response.sendRedirect("https://mineping.store");
    }
}