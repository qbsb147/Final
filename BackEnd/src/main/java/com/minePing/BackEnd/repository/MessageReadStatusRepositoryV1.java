package com.minePing.BackEnd.repository;

public interface MessageReadStatusRepositoryV1 {
    int updateRead(Long roomNo, String userId, String workerId);
}
