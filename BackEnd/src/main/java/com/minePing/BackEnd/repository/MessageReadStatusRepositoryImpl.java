package com.minePing.BackEnd.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.UUID;

@Repository
public class MessageReadStatusRepositoryImpl implements MessageReadStatusRepositoryV1{

    @PersistenceContext
    private EntityManager entityManager;

    public int markMessageRead(Long roomNo, UUID publicUuid, Long currentTime) {
        String jpql = """
                UPDATE MessageReadStatus m
                SET m.isRead = true, m.batchIn = :currentTime
                WHERE m.chatRoom.roomNo = :roomNo
                AND m.member.publicUuid = :publicUuid
                AND m.isRead = false
                """;
        return entityManager.createQuery(jpql)
                .setParameter("currentTime", currentTime)
                .setParameter("roomNo", roomNo)
                .setParameter("publicUuid", publicUuid)
                .executeUpdate();
    }
}
