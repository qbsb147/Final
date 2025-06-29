package com.minePing.BackEnd.dto;

import com.minePing.BackEnd.entity.Department;
import lombok.*;

public class DepartmentDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Search {
        private Long department_no;
        private String department_name;

        public static Search toDto(Department department) {
            return Search.builder()
                    .department_no(department.getDepartmentNo())
                    .department_name(department.getDepartmentName())
                    .build();
        }
    }
}
