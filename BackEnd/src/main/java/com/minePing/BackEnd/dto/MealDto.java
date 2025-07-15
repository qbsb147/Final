package com.minePing.BackEnd.dto;

import lombok.*;

public class MealDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class check {
        private boolean body;
        private boolean stress;
        private boolean burnout;
        private boolean preference;
    }
}
