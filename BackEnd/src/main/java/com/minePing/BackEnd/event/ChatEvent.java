package com.minePing.BackEnd.event;

import com.minePing.BackEnd.enums.MemberEnums;

import java.util.UUID;

public class ChatEvent {

    public record UserStateEvent(MemberEnums.Status status, UUID publicUuid) {}
    
    public record ChatReadEvent(Long roomNo, UUID publicUuid) {}
}
