package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.ChatParticipant;
import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatParticipantRepositoryV1 {
    List<ChatParticipant> findAllByChatRoomsInBatches(List<ChatRoom> chatRooms, Member currentMember, int batchSize);
}
