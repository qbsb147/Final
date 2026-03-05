package com.minePing.BackEnd.repository;

import java.sql.Timestamp;
import java.util.UUID;

public interface MessageReadStatusRepositoryV1 {
    int markMessageRead(Long roomNo, UUID publicUuid, Long idempotentKey);
}
