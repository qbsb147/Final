package com.minePing.BackEnd.service.userStateHandler;

import com.minePing.BackEnd.enums.MemberEnums;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class UserStateFactory {
    private final Map<MemberEnums.Status, UserStateHandler> handlerMap;

    public UserStateFactory(List<UserStateHandler> handlers) {
        handlerMap = handlers.stream().collect(Collectors.toMap(
                UserStateHandler::getState,
                Function.identity()
        ));
    }

    public UserStateHandler getHandler(MemberEnums.Status state){
        return handlerMap.get(state);
    }

}
