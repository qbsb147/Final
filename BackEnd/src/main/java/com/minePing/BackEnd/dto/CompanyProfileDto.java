package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.dto.CompanyDto.CompanyInfoResponse;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.WorcationApplication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import lombok.*;

public class CompanyProfileDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Join {

        @NotNull(message = "회사 선택은 필수입니다.")
        private Long company_no;

        @NotBlank(message = "부서 설정은 필수입니다.")
        private String department_name;

        @NotBlank(message = "직급 설정은 필수입니다.")
        private String position;

        @NotBlank(message = "회사 전용 이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String company_email;

        @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다.")
        private String company_phone;
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {

        private Long user_no;
        private String department_name; // 부서명
        private String position; // 직급
        private String name; // 이름
        private String gender; // 성별 (Enum -> String)
        private int age; // 생년월일 -> 나이 계산
        private String role; // 역할 (Enum -> String)
        private String company_email;
        private String work_status;

        public static Response toDto(Member member, String workStatus, int age) {
            CompanyProfile profile = member.getCompanyProfile();

            return Response.builder()
                    .user_no(member.getUserNo())
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .role(member.getRole().name())
                    .company_email(profile.getCompanyEmail())
                    .work_status(workStatus)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Approval {
        private Long user_no;
        private String department_name;
        private String position;
        private String name;
        private String gender;
        private int age;
        private String role;
        private String company_email;
        private String phone;
        private String approve;

        public static Approval toDto(Member member, int age) {
            CompanyProfile profile = member.getCompanyProfile();

            return Approval.builder()
                    .user_no(member.getUserNo())
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .role(member.getRole().name())
                    .company_email(profile.getCompanyEmail())
                    .phone(member.getPhone())
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
        private String work_status;
        private String psychological_state;

        public static Consult toDto(Member member,String workStatus,int age, String psychologicalState) {
            CompanyProfile profile = member.getCompanyProfile();

            return Consult.builder()
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .company_email(profile.getCompanyEmail())
                    .work_status(workStatus)
                    .psychological_state(psychologicalState)
                    .build();

        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Applies {
        private Long user_no;
        private String department_name;
        private String position;
        private String name;
        private String gender;
        private int age;
        private String company_email;
        private String worcation_date;
        private String worcation_place;

        public static Applies toDto(Member member, String worcationDate, int age, String worcationPlace) {
            CompanyProfile profile = member.getCompanyProfile();

            return Applies.builder()
                    .user_no(member.getUserNo())
                    .department_name(profile.getDepartmentName())
                    .position(profile.getPosition())
                    .name(member.getName())
                    .gender(member.getGender().name())
                    .age(age)
                    .company_email(profile.getCompanyEmail())
                    .worcation_date(worcationDate)
                    .worcation_place(worcationPlace)
                    .build();
        }

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Employees {
        private int totalEmployees;
        private int worcationEmployees;
        private int currentEmployees;

        public static Employees toDto(int totalEmployees, int worcationEmployees, int currentEmployees) {
            return Employees.builder()
                    .totalEmployees(totalEmployees)
                    .worcationEmployees(worcationEmployees)
                    .currentEmployees(currentEmployees)
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CompanyProfileInfoResponse {
        private String company_name;
        private String department_name;
        private String position;
        private String phone;
        private String company_address;
        private String company_email;
        private String company_phone;
        private CompanyInfoResponse company_info;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder

    public static class Calendar{
        private Long user_no;
        private String user_name;
        private String worcation_place;
        private LocalDate start_date;
        private LocalDate end_date;

        public static Calendar toDto(WorcationApplication worcationApplication,Member member, String worcationPlace) {

            return Calendar.builder()
                    .user_no(member.getUserNo())
                    .user_name(member.getName())
                    .worcation_place(worcationPlace)
                    .start_date(worcationApplication.getStartDate())
                    .end_date(worcationApplication.getEndDate())
                    .build();
        }

    }

    @ToString
    public static class Update {

        @NotNull(message = "회사 선택은 필수입니다.")
        private Long company_no;

        @NotBlank(message = "부서 설정은 필수입니다.")
        private String department_name;

        @NotBlank(message = "직급 설정은 필수입니다.")
        private String position;

        @NotBlank(message = "회사 전용 이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String company_email;

        @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다.")
        private String company_phone;
    }

}