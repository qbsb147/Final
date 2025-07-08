package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.TempOAuthUser;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempOAuthUserStore {

    private final Map<String, TempOAuthUser> store = new ConcurrentHashMap<>();

    public void save(String uuid, TempOAuthUser user) {
        store.put(uuid, user);
    }

    public Optional<TempOAuthUser> find(String uuid) {
        TempOAuthUser user = store.get(uuid);
        if (user == null || user.isExpired()) {
            store.remove(uuid);
            return Optional.empty();
        }
        return Optional.of(user);
    }

    public void remove(String uuid) {
        store.remove(uuid);
    }
}
