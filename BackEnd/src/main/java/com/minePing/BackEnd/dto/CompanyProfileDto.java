package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import java.time.LocalDate;
import java.time.Period;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class CompanyProfileDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {

        private String department_name; // 부서명
        private String position;        // 직급
        private String name;            // 이름
        private String gender;          // 성별 (Enum -> String)
        private int age;                // 생년월일 -> 나이 계산
        private String role;            // 역할 (Enum -> String)
        private String company_email;           // 회사 이메일 아님
        private String workStatus;      // 근무 상태 (외부 전달 값)

        public static Response toDto(Member member, String workStatus, int age) {
            CompanyProfile profile = member.getCompanyProfile();

            return Response.builder()
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .role(member.getRole().name())
                    .company_email(profile.getCompanyEmail())
                    .workStatus(workStatus)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Approval {
        private String department_name;
        private String position;
        private String name;
        private String gender;
        private int age;
        private String role;
        private String company_email;
        private String approve;

        public static Approval toDto(Member member, int age) {
            CompanyProfile profile = member.getCompanyProfile();

            return Approval.builder()
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .role(member.getRole().name())
                    .company_email(profile.getCompanyEmail())
                    .approve(profile.getApprove().name())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Consult {
        private String department_name;
        private String position;
        private String name;
        private String gender;
        private int age;
        private String company_email;
        private String workStatus;
        private String resultContent;

        public static Consult toDto(Member member,String workStatus,int age, String resultContent) {
            CompanyProfile profile = member.getCompanyProfile();

            return Consult.builder()
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .company_email(profile.getCompanyEmail())
                    .workStatus(workStatus)
                    .resultContent(resultContent)
                    .build();

        }
    }

}