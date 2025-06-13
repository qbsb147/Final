package com.minePing.BackEnd.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public class CommonEnums {
    public enum Status {
        Y, N
    }

    public enum Gender {
        M, Y
    }

    public enum Role {
        master, manager, employee, worcation, admin
    }

    public enum Approve {
        Y, N
    }
}
