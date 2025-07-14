package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberPreferenceDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberPreferenceServiceImpl implements MemberPreferenceService{

    private final MemberPreferenceRepository memberPreferenceRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public void savePreference(MemberPreferenceDto.Request requestDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();

        MemberPreference memberPreference = memberPreferenceRepository.findByMember_UserId(userId)
                        .orElse(requestDto.toEntity());

        if(memberPreference.getMember() == null) {
            Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                    .orElseThrow(()-> new UserNotFoundException());
            memberPreference.changeMember(member);
        }

    }
}
