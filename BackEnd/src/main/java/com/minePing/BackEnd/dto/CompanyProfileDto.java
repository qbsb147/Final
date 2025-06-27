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
