package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.ChatParticipant;
import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatParticipantRepositoryImpl implements ChatParticipantRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<ChatParticipant> findAllByChatRoomsInBatches(List<ChatRoom> chatRooms, Member currentMember, int batchSize) {
        List<ChatParticipant> result = new ArrayList<>();
        for(int i = 0; i<chatRooms.size(); i += batchSize){
            int end = Math.min(i+batchSize, chatRooms.size());
            List<ChatRoom> batch = chatRooms.subList(i,end);
            List<ChatParticipant> batchResult = em.createQuery(
                    """
    select cp
    from ChatParticipant cp
    join fetch cp.member
    where cp.chatRoom in :chatRooms
    and cp.member != :currentMember
""", ChatParticipant.class)
                    .setParameter("chatRooms", batch)
                    .setParameter("currentMember", currentMember)
                    .getResultList();
            result.addAll(batchResult);
        }
        return result;
    }
}
