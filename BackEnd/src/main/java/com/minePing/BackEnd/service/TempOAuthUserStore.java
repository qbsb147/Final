package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.TempOAuthUser;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public interface TempOAuthUserStore {
    void save(String uuid, TempOAuthUser user);
    Optional<TempOAuthUser> find(String uuid);
    void cleanUpExpiredItems();
}
