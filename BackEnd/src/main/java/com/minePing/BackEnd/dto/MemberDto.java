package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.*;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MemberDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmployeeJoin {

        private String user_id;
        private String user_pwd;
        private String name;
        private CommonEnums.Gender gender;
        private String address;
        private String birthday;
        private String email;
        private String phone;
        private CommonEnums.Role role;
        private String company_no;
        private String department;
        private String position;
        private String company_email;
        private String company_phone;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MasterJoin {

        private String user_id;
        private String user_pwd;
        private String name;
        private CommonEnums.Gender gender;
        private String address;
        private String birthday;
        private String email;
        private String phone;
        private CommonEnums.Role role;
        private String company_name;
        private String company_address;
        private String business_id;
        private String company_email;
        private String licensee;
        private String company_tel;
        private LocalDate open_date;
        private String company_phone;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WorcationJoin {

        private String user_id;
        private String user_pwd;
        private String name;
        private CommonEnums.Gender gender;
        private String address;
        private String birthday;
        private String email;
        private String phone;
        private CommonEnums.Role role;
    }

}
