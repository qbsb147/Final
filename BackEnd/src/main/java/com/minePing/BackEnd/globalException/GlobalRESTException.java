package com.minePing.BackEnd.globalException;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalRESTException {
    @ExceptionHandler(Exception.class)
    public String handleException(Exception e, Model model) {
        model.addAttribute("errorMsg", "서버에 문제가 생겼습니다.");
        return "errorPage";
    }

    @ExceptionHandler(NullPointerException.class)
    public String NullPointerException(Exception e, Model model) {
        model.addAttribute("errorMsg", "처리되지 못한 데이터가 존재합니다.");
        return "errorPage";
    }

}
