package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.dto.MessageProjection;
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
    @Query(
            value = """
        SELECT 
            msg.message_no AS message_no,
            BIN_TO_UUID(mem.public_uuid) AS public_uuid,
            mem.name AS name,
            mem.nick_name AS nick_name,
            msg.content AS content,
            COUNT(r.read_no) AS unread_count,
            msg.date_time AS date_time
        FROM chat_message msg
        JOIN member mem ON msg.user_no = mem.user_no
        LEFT JOIN message_read_status r
            ON r.message_no = msg.message_no
            AND r.is_read = false
        WHERE msg.room_no = :roomNo
        GROUP BY msg.message_no, mem.public_uuid, mem.name, mem.nick_name, msg.content, msg.date_time
    """,
            countQuery = """
        SELECT COUNT(*) 
        FROM chat_message msg
        WHERE msg.room_no = :roomNo
    """,
            nativeQuery = true
    )
    Page<MessageProjection> findMessagesWithUnreadAndMember(@Param("roomNo") Long roomNo, Pageable pageable);}
