package com.minePing.BackEnd.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Arrays;

public class CommonEnums {

    public enum Status {
        Y, N;

        @JsonCreator
        public static Status from(String value) {
            return Arrays.stream(Status.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Status: " + value));
        }
    }

    public enum Gender {
        M, W;

        @JsonCreator
        public static Gender from(String value) {
            return Arrays.stream(Gender.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Gender: " + value));
        }
    }

    public enum Role {
        MASTER, MANAGER, EMPLOYEE, WORCATION, ADMIN, TEMP;

        @JsonCreator
        public static Role from(String value) {
            return Arrays.stream(Role.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Role: " + value));
        }
    }

    public enum Approve {
        Y, N, W;

        @JsonCreator
        public static Approve from(String value) {
            return Arrays.stream(Approve.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Approve: " + value));
        }
    }
}
