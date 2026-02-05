package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.entity.ChatParticipant;
import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("""
        select rm
        from ChatRoom rm
        join fetch rm.chatParticipants cp
        where cp in :chatParticipants
""")
    List<ChatRoom> findRoomList(@Param("chatParticipants") List<ChatParticipant> chatParticipants);

    List<ChatRoom> findByNameAndSeparation(String name, String separation);
}
