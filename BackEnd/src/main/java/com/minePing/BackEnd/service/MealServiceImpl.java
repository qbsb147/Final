package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MealDto;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.HealthRepository;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.MentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MealServiceImpl implements MealService {

    private final HealthRepository healthRepository;
    private final MentalRepository mentalRepository;
    private final MemberPreferenceRepository memberPreferenceRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Override
    public MealDto.check check() {
//        AtomicBoolean body = new AtomicBoolean(false);
//        AtomicBoolean preference = new AtomicBoolean(false);
//        AtomicBoolean burnout = new AtomicBoolean(false);
//        AtomicBoolean stress = new AtomicBoolean(false);

        boolean body = false;
        boolean preference = false;
        boolean burnout = false;
        boolean stress = false;

        String user_id = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(user_id, Status.Y)
                .orElseThrow(() -> new UserNotFoundException());
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        Health health =healthRepository.findByMemberAndUpdateDateAfter(member, oneMonthAgo);
        if (health != null) {
            body = true;
        }
        for (Mental mental : mentalRepository.findByMemberAndUpdateDateAfter(member, oneMonthAgo)) {
            if (mental.getSeparation() == MentalEnums.Separation.BURNOUT) {
                burnout = true;
            } else if (mental.getSeparation() == MentalEnums.Separation.STRESS) {
                stress = true;
            }
            if (burnout && stress) {
                break;
            }
        }

        List<MemberPreference> memberPreferences = memberPreferenceRepository.findByMemberAndUpdateDateAfter(member, oneMonthAgo);
        if (!memberPreferences.isEmpty()) {
            preference = true;
        }

        return new MealDto.check(body, stress, burnout, preference);
    }
}
