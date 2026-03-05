package com.minePing.BackEnd.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public interface MessageProjection {
    Long getMessage_no();
    UUID getPublic_uuid();
    String getName();
    String getNick_name();
    String getContent();
    Integer getUnread_count();
    LocalDateTime getDate_time();
}