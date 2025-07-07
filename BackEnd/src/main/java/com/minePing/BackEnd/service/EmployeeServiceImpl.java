package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyProfileDto;
import com.minePing.BackEnd.dto.CompanyProfileDto.Applies;
import com.minePing.BackEnd.dto.CompanyProfileDto.Calendar;
import com.minePing.BackEnd.dto.CompanyProfileDto.Employees;
import com.minePing.BackEnd.dto.CompanyProfileDto.Response;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.MentalEnums;
import com.minePing.BackEnd.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Page<Response> findAllMember(Long companyNo, Pageable pageable) {
        LocalDate today = LocalDate.now();

        return employeeRepository.findAllByCompanyNo(companyNo, pageable)
                .map(profile -> {
                    Member member = profile.getMember();

                    String workStatus = member.getWorcationApplications().stream()
                            .filter(app -> app.getApprove() == CommonEnums.Approve.Y)
                            .anyMatch(app -> !today.isBefore(app.getStartDate()) && !today.isAfter(app.getEndDate()))
                            ? "워케이션 중" : "근무 중";

                    int age = Period.between(member.getBirthday(), today).getYears();

                    return CompanyProfileDto.Response.toDto(member, workStatus, age);
                });
    }

    @Override
    public List<CompanyProfileDto.Approval> findgetApprovalList(Long companyNo) {
        LocalDate today = LocalDate.now();

        return employeeRepository.findAllApprovalByCompanyNoAndApproveN(companyNo).stream()
                .map(profile -> {
                    Member member = profile.getMember();
                    int age = Period.between(member.getBirthday(), today).getYears();
                    return CompanyProfileDto.Approval.toDto(member, age);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Page<CompanyProfileDto.Consult> findConsultList(Long companyNo, Pageable pageable) {
        LocalDate today = LocalDate.now();

        return employeeRepository.findAllConsultByCompanyNo(companyNo, pageable)
                .map(profile -> {
                    Member member = profile.getMember();

                    String workStatus = member.getWorcationApplications().stream()
                            .filter(app -> app.getApprove() == CommonEnums.Approve.Y)
                            .anyMatch(app -> !today.isBefore(app.getStartDate()) && !today.isAfter(app.getEndDate()))
                            ? "워케이션 중" : "근무 중";

                    int age = Period.between(member.getBirthday(), today).getYears();

                    String psychologicalState = member.getMentals().stream()
                            .map(m -> m.getPsychologicalState().name())
                            .findFirst()
                            .orElse("Unknown");

                    return CompanyProfileDto.Consult.toDto(member, workStatus, age, psychologicalState);
                });
    }

    @Override
    public Page<Applies> findWorcationAppliesList(Long companyNo, Pageable pageable) {
        LocalDate today = LocalDate.now();

        Page<CompanyProfile> pageProfiles = employeeRepository.findallWorcationAppliesByCompanyNo(companyNo, pageable);

        List<Applies> appliesList = pageProfiles.stream()
                .flatMap(profile -> {
                    Member member = profile.getMember();
                    int age = Period.between(member.getBirthday(), today).getYears();

                    return member.getWorcationApplications().stream()
                            .filter(wa -> wa.getApprove() == CommonEnums.Approve.W) // 승인 대기만 매핑 (필요시)
                            .map(application -> {
                                String worcationDate = application.getStartDate() + " ~ " + application.getEndDate();
                                String worcationPlace = application.getWorcation().getWorcationName();

                                return Applies.toDto(member, worcationDate, age, worcationPlace);
                            });
                })
                .collect(Collectors.toList());

        return new PageImpl<>(appliesList, pageable, pageProfiles.getTotalElements());
    }

    @Override
    public Employees findEmployeesNumber(Long companyNo) {
        LocalDate today = LocalDate.now();

        int total = employeeRepository.countAllByCompanyNo(companyNo); // ✅ 수정
        int worcation = employeeRepository.countWorcationInProgressByCompanyNo(companyNo, today);
        int current = total - worcation;

        return Employees.toDto(total, worcation, current);
    }

    @Override
    @Transactional
    public void updateApproveStatus(Long userNo, String status) {
        CompanyProfile companyProfile = employeeRepository.findByMember_UserNo(userNo).orElseThrow();

        companyProfile.updateStatus(CommonEnums.Approve.valueOf(status));
    }

    @Override
    @Transactional
    public void updateWorcationStatus(Long userNo, String status) {
        WorcationApplication application = employeeRepository.findWorcationApplicationByUserNo(userNo)
                .orElseThrow(() -> new RuntimeException("WorcationApplication not found for userNo: " + userNo));
        application.updatestatus(CommonEnums.Approve.valueOf(status));
    }

    @Override
    public List<Calendar> getWorcationCalendar(Long companyNo) {
        return employeeRepository.findApprovedWorcationApplications(companyNo).stream()

                .map(app -> CompanyProfileDto.Calendar.toDto(
                        app,
                        app.getMember(),
                        app.getWorcation().getWorcationName()
                ))
                .collect(Collectors.toList());
    }


}
