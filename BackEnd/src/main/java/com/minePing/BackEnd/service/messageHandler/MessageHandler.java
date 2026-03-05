package com.minePing.BackEnd.service.messageHandler;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.enums.SocketEnums;

import java.io.IOException;

public interface MessageHandler {
    void handle(MessageDto.Request chatMessageDto) throws IOException;

    SocketEnums.type getType();
}
