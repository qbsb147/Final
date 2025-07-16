package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MealDto;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.entity.MemberPreference;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.repository.HealthRepository;
import com.minePing.BackEnd.repository.MemberPreferenceRepository;
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
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        Health health =healthRepository.findByMember_UserIdAndUpdateDateAfter(user_id, oneMonthAgo);
        if (health != null) {
            body = true;
        }
        for (Mental mental : mentalRepository.findByMember_UserIdAndUpdateDateAfter(user_id, oneMonthAgo)) {
            if (mental.getSeparation() == MentalEnums.Separation.BURNOUT) {
                burnout = true;
            } else if (mental.getSeparation() == MentalEnums.Separation.STRESS) {
                stress = true;
            }
            if (burnout && stress) {
                break;
            }
        }
        List<MemberPreference> memberPreferences = memberPreferenceRepository.findByMember_UserIdAndUpdateDateAfter(user_id, oneMonthAgo);
        if (!memberPreferences.isEmpty()) {
            preference = true;
        }

        return new MealDto.check(body, stress, burnout, preference);
    }
}
