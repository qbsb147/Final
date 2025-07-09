package com.minePing.BackEnd.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.minePing.BackEnd.dto.CompanyDto.CompanyInfoResponse;
import com.minePing.BackEnd.dto.CompanyProfileDto.CompanyProfileInfoResponse;
import com.minePing.BackEnd.entity.*;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.SocialType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class MemberDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class init {
        private String user_id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MemberJoinDto {
        @NotBlank(message = "아이디는 필수입니다.")
        private String user_id;

        @NotBlank(message = "비밀번호는 필수입니다.")
//        @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
//        @Pattern(
//                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
//                message = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
//        )
        private String user_pwd;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;

        @NotNull(message = "성별 설정은 필수입니다.")
        private CommonEnums.Gender gender;

        @NotNull(message = "권한 설정은 필수입니다.")
        private CommonEnums.Role role;

        @NotBlank(message = "주소는 필수입니다.")
        private String address;

        @NotNull(message = "생년월일은 필수입니다.")
        @Past(message = "생년월일은 과거 날짜여야 합니다.")
        private LocalDate birthday;

        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "전화번호는 필수입니다.")
        @Pattern(regexp = "^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다.(01x-xxxx-xxxx)")
        private String phone;
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class EmployeeJoin {

        @Valid
        private MemberJoinDto memberJoinDto;
        @Valid
        private CompanyProfileDto.Join companyProfileJoinDto;

        public CompanyProfile toCompanyProfileEntity() {
            return CompanyProfile.builder()
                    .departmentName(this.companyProfileJoinDto.getDepartment_name())
                    .position(this.companyProfileJoinDto.getPosition())
                    .companyPhone(this.companyProfileJoinDto.getCompany_phone())
                    .companyEmail(this.companyProfileJoinDto.getCompany_email())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MasterJoin {

        @Valid
        private MemberJoinDto memberJoinDto;
        @Valid
        private CompanyDto.Join companyJoinDto;

        public Company toCompanyEntity() {
            return Company.builder()
                    .companyName(this.companyJoinDto.getCompany_name())
                    .companyAddress(this.companyJoinDto.getCompany_address())
                    .businessId(this.companyJoinDto.getBusiness_id())
                    .businessEmail(this.companyJoinDto.getBusiness_email())
                    .licensee(this.companyJoinDto.getLicensee())
                    .companyTel(this.companyJoinDto.getCompany_tel())
                    .openDate(this.companyJoinDto.getOpen_date())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WorcationJoin {

        @Valid
        private MemberJoinDto memberJoinDto;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Login {
        private String user_id;
        private String user_pwd;
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class LoginResponse {
        private String user_id;
        private CommonEnums.Role role;

        public static LoginResponse toDto(Member member) {
            return LoginResponse.builder()
                    .user_id(member.getUserId())
                    .role(member.getRole())
                    .build();
        }
    }


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UpdateRole {
        private CommonEnums.Role role;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class InfoResponse {
        private Long user_no;
        private String user_id;
        private String user_name;
        private Long company_no;
        private SocialType social_type;
        private CommonEnums.Role role;
        private CommonEnums.Approve employee_approve;

        public static InfoResponse toMemberDto(Member member) {
            return InfoResponse.builder()
                    .user_no(member.getUserNo())
                    .user_id(member.getUserId())
                    .user_name(member.getName())
                    .role(member.getRole())
                    .social_type(member.getSocialType())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class KakaoLogin{
        private String code;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MemberInfoResponse {
        private String user_id;
        private String email;
        private String name;
        private String address;
        private String phone;
        private LocalDate birthday;
        private CommonEnums.Gender gender;
        private CompanyInfoResponse company_info;
        private CompanyProfileInfoResponse company_profile_info;

        public static MemberInfoResponse toMasterDto(Member member) {
            return MemberInfoResponse.builder()
                    .user_id(member.getUserId())
                    .email(member.getEmail())
                    .name(member.getName())
                    .address(member.getAddress())
                    .birthday(member.getBirthday())
                    .gender(member.getGender())
                    .phone(member.getPhone())
                    .company_info(CompanyInfoResponse.builder()
                            .company_name(member.getCompany().getCompanyName())
                            .company_address(member.getCompany().getCompanyAddress())
                            .business_email(member.getCompany().getBusinessEmail())
                            .company_tel(member.getCompany().getCompanyTel())
                            .departments(member.getCompany().getDepartments().stream()
                                    .map(department -> DepartmentDto.Response.builder()
                                            .department_no(department.getDepartmentNo())
                                            .department_name(department.getDepartmentName())
                                            .build()
                                    ).collect(Collectors.toList())
                            )
                            .build())
                    .build();
        }

        public static MemberInfoResponse toWorcationDto(Member member) {
            return MemberInfoResponse.builder()
                    .user_id(member.getUserId())
                    .email(member.getEmail())
                    .name(member.getName())
                    .address(member.getAddress())
                    .phone(member.getPhone())
                    .birthday(member.getBirthday())
                    .gender(member.getGender())
                    .build();
        }

        public static MemberInfoResponse toEmployeeDto(Member member) {
            return MemberInfoResponse.builder()
                    .user_id(member.getUserId())
                    .email(member.getEmail())
                    .name(member.getName())
                    .address(member.getAddress())
                    .phone(member.getPhone())
                    .birthday(member.getBirthday())
                    .gender(member.getGender())
                    .company_profile_info(CompanyProfileInfoResponse.builder()
                            .department_name(member.getCompanyProfile().getDepartmentName())
                            .position(member.getCompanyProfile().getPosition())
                            .company_email(member.getCompanyProfile().getCompanyEmail())
                            .company_phone(member.getCompanyProfile().getCompanyPhone())
                            .company_info(CompanyInfoResponse.builder()
                                    .company_no(member.getCompanyProfile().getCompany().getCompanyNo())
                                    .company_name(member.getCompanyProfile().getCompany().getCompanyName())
                                    .build()
                            )
                            .build())
                    .build();
        }
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @ToString
    public static class Update {

//        @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
//        @Pattern(
//                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
//                message = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
//        )
        private String user_pwd;

        @NotBlank(message = "이름은 필수입니다.")
        private String name;

        @NotBlank(message = "주소는 필수입니다.")
        private String address;

        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "전화번호는 필수입니다.")
        @Pattern(regexp = "^01[0-9]-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다.(01x-xxxx-xxxx)")
        private String phone;

        @Valid
        private CompanyProfileDto.Update company_profile_update;

        @Valid
        private CompanyDto.Update company_update;
    }
}
