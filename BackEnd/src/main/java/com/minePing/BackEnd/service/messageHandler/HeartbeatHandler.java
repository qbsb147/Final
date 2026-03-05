package com.minePing.BackEnd.service.messageHandler;

import com.minePing.BackEnd.dto.MessageDto;
import com.minePing.BackEnd.enums.MemberEnums;
import com.minePing.BackEnd.enums.SocketEnums;
import com.minePing.BackEnd.event.ChatEvent;
import com.minePing.BackEnd.service.ChatService;
import com.minePing.BackEnd.service.userStateHandler.UserStateFactory;
import com.minePing.BackEnd.service.userStateHandler.UserStateHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class HeartbeatHandler implements MessageHandler{

    private final UserStateFactory userStateFactory;

    @Override
    public void handle(MessageDto.Request messageDto) throws IOException {
        ChatEvent.UserStateEvent userStateEvent = new ChatEvent.UserStateEvent(MemberEnums.Status.Online, messageDto.getPublic_uuid());
        UserStateHandler userStateHandler = userStateFactory.getHandler(userStateEvent.status());
        UUID publicUuid = userStateEvent.publicUuid();
        userStateHandler.handle(publicUuid);
        userStateHandler.broadCast(publicUuid);
    }

    @Override
    public SocketEnums.type getType() {
        return SocketEnums.type.HEARTBEAT;
    }
}
