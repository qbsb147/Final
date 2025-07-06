package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Department;
import lombok.*;

public class DepartmentDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long department_no;
        private String department_name;

        public static Response toDto(Department department) {
            return Response.builder()
                    .department_no(department.getDepartmentNo())
                    .department_name(department.getDepartmentName())
                    .build();
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @ToString
    public static class Request {
        private Long department_no;
        private String department_name;
    }
}
