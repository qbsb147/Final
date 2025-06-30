package com.minePing.BackEnd.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public class CommonEnums {
    public enum Status {
        Y, N
    }

    public enum Gender {
        M, W
    }

    public enum Role {
        MASTER, MANAGER, EMPLOYEE, WORCATION, ADMIN
    }

    public enum Approve {

        Y, N, W

    }
}
