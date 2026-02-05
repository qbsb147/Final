package com.minePing.BackEnd.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class MessageReadStatusRepositoryImpl implements MessageReadStatusRepositoryV1{

    @PersistenceContext
    private EntityManager entityManager;

    public int updateRead(Long roomNo, String userId, String workerId) {
        String jpql = """
                UPDATE MessageReadStatus m
                SET m.isRead = true
                WHERE m.chatRoom.roomNo = :roomNo
                AND m.member.userId = :userId
                AND m.isRead = false
                """;
        return entityManager.createQuery(jpql)
                .setParameter("roomNo", roomNo)
                .setParameter("userId", userId)
                .executeUpdate();
    }
}
