package com.minePing.BackEnd.config;

import com.minePing.BackEnd.service.TempOAuthUserStore;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class TempUserCleanupTask {

    private final TempOAuthUserStore tempOAuthUserStore;

    public TempUserCleanupTask(TempOAuthUserStore tempOAuthUserStore) {
        this.tempOAuthUserStore = tempOAuthUserStore;

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> tempOAuthUserStore.cleanUpExpiredItems(), 0, 1, TimeUnit.HOURS);
    }
}
