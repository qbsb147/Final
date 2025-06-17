package com.minePing.BackEnd.entity;

import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_no")
    private Long departmentNo;

    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;

    @OneToMany(mappedBy = "company_department", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CompanyDepartment> companyDepartments = new ArrayList<>();

}
