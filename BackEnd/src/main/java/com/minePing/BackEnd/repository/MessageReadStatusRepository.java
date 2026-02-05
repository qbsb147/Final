package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.MessageReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageReadStatusRepository extends JpaRepository<MessageReadStatus, Long>, MessageReadStatusRepositoryV1 {

    @Query("""
select rs.chatRoom.roomNo,
case
    when count(rs) > 300
        then 301
        else count(rs)
    end as unreadCount
from MessageReadStatus rs
where rs.isRead = false
and rs.member.userId = :userId
group by rs.chatRoom
""")
    List<Object[]> countUnreadMessagesByUserId(@Param("userId")String userId);

}
