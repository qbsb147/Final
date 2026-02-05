package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.ChatMessage;
import com.minePing.BackEnd.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("""
    select msg
    from ChatMessage msg
    where msg.chatRoom in :rooms
    and msg.messageNo = (
        select max(msg2.messageNo)
        from ChatMessage msg2
        where msg2.chatRoom = msg.chatRoom
    )
""")
    List<ChatMessage> findLastMessages(@Param("rooms") List<ChatRoom> rooms);

    Page<ChatMessage> findAllByChatRoom_RoomNo(Long roomNo, Pageable pageable);
}
