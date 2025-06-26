package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.*;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.*;
import java.time.Period;
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

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {

        private String department_name;
        private String position;
        private String name;
        private String gender;
        private int age;
        private String role;
        private String email;
        private String workStatus;

        public static Response toDto(Member member, String workStatus) {
            CompanyProfile profile = member.getCompanyProfile();
            return Response.builder()
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(Period.between(member.getBirthday(), LocalDate.now()).getYears())
                    .role(member.getRole().name())
                    .email(member.getEmail())
                    .workStatus(workStatus)
                    .build();
        }

    }

}
