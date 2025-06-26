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
    @Builder
    public static class EmployeeJoin {

        private String user_id;
        private String user_pwd;
        private String name;
        private CommonEnums.Gender gender;
        private String address;
        private LocalDate birthday;
        private String email;
        private String phone;
        private CommonEnums.Role role;
        private String company_no;
        private String department;
        private String position;
        private String company_email;
        private String company_phone;
        private Member member;
        private Company company;

        public Member toMemberEntity() {
            return Member.builder()
                    .userId(this.user_id)
                    .userPwd(this.user_pwd)
                    .name(this.name)
                    .gender(this.gender)
                    .address(this.address)
                    .birthday(this.birthday)
                    .email(this.email)
                    .phone(this.phone)
                    .role(this.role)
                    .build();
        }

        public CompanyProfile toCompanyProfileEntity() {
            return CompanyProfile.builder()
                    .member(this.member)
                    .company(this.company)
                    .departmentName(this.department)
                    .position(this.position)
                    .companyPhone(this.company_phone)
                    .companyEmail(this.company_email)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MasterJoin {

        private String user_id;
        private String user_pwd;
        private String name;
        private CommonEnums.Gender gender;
        private String address;
        private LocalDate birthday;
        private String email;
        private String phone;
        private CommonEnums.Role role;
        private String company_name;
        private String company_address;
        private String business_id;
        private String business_email;
        private String licensee;
        private String company_tel;
        private LocalDate open_date;
        private String company_phone;

        public Member toMemberEntity() {
            return Member.builder()
                    .userId(this.user_id)
                    .userPwd(this.user_pwd)
                    .name(this.name)
                    .gender(this.gender)
                    .address(this.address)
                    .birthday(this.birthday)
                    .email(this.email)
                    .phone(this.phone)
                    .role(this.role)
                    .build();
        }

        public Company toCompanyEntity() {
            return Company.builder()
                    .companyName(this.company_name)
                    .companyAddress(this.company_address)
                    .businessId(this.business_id)
                    .businessEmail(this.business_email)
                    .licensee(this.licensee)
                    .companyTel(this.company_tel)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
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
    @ToString
    public static class Login{
        private String user_id;
        private String user_pwd;
    }

}
