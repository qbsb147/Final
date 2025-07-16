package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MemberPreferenceDto;

public interface MemberPreferenceService {
    void savePreference(MemberPreferenceDto.Request requestDto);
}
