package com.minePing.BackEnd.service.userStateHandler;

import com.minePing.BackEnd.enums.MemberEnums;

import java.io.IOException;
import java.util.UUID;

public interface UserStateHandler {
    void handle(UUID publicUuid);
    void broadCast(UUID publicUuid) throws IOException;
    MemberEnums.Status getState();
}
