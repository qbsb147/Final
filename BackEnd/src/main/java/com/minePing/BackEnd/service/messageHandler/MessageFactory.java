package com.minePing.BackEnd.service.messageHandler;

import com.minePing.BackEnd.enums.SocketEnums;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class MessageFactory {
    private final Map<SocketEnums.type, MessageHandler> handlerMap;

    public MessageFactory(List<MessageHandler> commands){
        handlerMap = commands.stream().collect(Collectors.toMap(
                MessageHandler::getType,
                Function.identity()
        ));
    }

    public MessageHandler getHandler(SocketEnums.type type){
        return handlerMap.get(type);
    }
}
