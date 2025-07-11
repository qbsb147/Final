package com.minePing.BackEnd.dto;

import lombok.Getter;
import lombok.Setter;

public class MailVerificationRequestDto {
    @Setter
    @Getter
    public static class Send {
        private String email;
    }
    @Getter
    @Setter
    public static class Verify {
        private String email;
        private String code;
    }
}