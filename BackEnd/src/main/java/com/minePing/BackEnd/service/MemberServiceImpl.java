package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.EmployeeJoin;
import com.minePing.BackEnd.dto.MemberDto.InfoResponse;
import com.minePing.BackEnd.dto.MemberDto.Login;
import com.minePing.BackEnd.dto.MemberDto.LoginResponse;
import com.minePing.BackEnd.dto.MemberDto.MasterJoin;
import com.minePing.BackEnd.dto.MemberDto.MemberInfoResponse;
import com.minePing.BackEnd.dto.MemberDto.Update;
import com.minePing.BackEnd.dto.MemberDto.WorcationJoin;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Department;
import com.minePing.BackEnd.entity.Member;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Role;
import com.minePing.BackEnd.enums.SocialType;

import com.minePing.BackEnd.exception.CompanyNotFoundException;
import com.minePing.BackEnd.exception.UserAuthenticationException;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.CompanyProfileRepository;
import com.minePing.BackEnd.repository.CompanyRepository;
import com.minePing.BackEnd.repository.DepartmentRepository;
import com.minePing.BackEnd.repository.MemberRepository;

import java.util.*;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final JwtTokenProvider jwtTokenProvider;



    @Override
    @Transactional
    public void createEmployeeMember(EmployeeJoin employeeJoinDto) {
        Member member = Member.builder()
                .userId(employeeJoinDto.getMemberJoinDto().getUser_id())
                .userPwd(passwordEncoder.encode(employeeJoinDto.getMemberJoinDto().getUser_pwd()))
                .name(employeeJoinDto.getMemberJoinDto().getName())
                .gender(employeeJoinDto.getMemberJoinDto().getGender())
                .address(employeeJoinDto.getMemberJoinDto().getAddress())
                .birthday(employeeJoinDto.getMemberJoinDto().getBirthday())
                .email(employeeJoinDto.getMemberJoinDto().getEmail())
                .phone(employeeJoinDto.getMemberJoinDto().getPhone())
                .role(employeeJoinDto.getMemberJoinDto().getRole())
                .build();

        memberRepository.save(member);

        CompanyProfile companyProfile = employeeJoinDto.toCompanyProfileEntity();

        companyProfile.changeMember(member);

        Company company = companyRepository.findById(employeeJoinDto.getCompanyProfileJoinDto().getCompany_no())
                .orElseThrow(() -> new CompanyNotFoundException());

        companyProfile.changeCompany(company);

        companyProfileRepository.save(companyProfile);
    }

    @Override
    @Transactional
    public void createMasterMember(MasterJoin masterJoinDto) {
        Member member = Member.builder()
                .userId(masterJoinDto.getMemberJoinDto().getUser_id())
                .userPwd(passwordEncoder.encode(masterJoinDto.getMemberJoinDto().getUser_pwd()))
                .name(masterJoinDto.getMemberJoinDto().getName())
                .gender(masterJoinDto.getMemberJoinDto().getGender())
                .role(masterJoinDto.getMemberJoinDto().getRole())
                .address(masterJoinDto.getMemberJoinDto().getAddress())
                .birthday(masterJoinDto.getMemberJoinDto().getBirthday())
                .email(masterJoinDto.getMemberJoinDto().getEmail())
                .phone(masterJoinDto.getMemberJoinDto().getPhone())
                .build();

        memberRepository.save(member);

        Company company = masterJoinDto.toCompanyEntity();
        company.changeMember(member);
        companyRepository.save(company);

        List<String> departments = masterJoinDto.getCompanyJoinDto().getDepartments();

        List<Department> departmentList = departments.stream()
                .map(name -> Department
                        .builder()
                        .departmentName(name)
                        .company(company)
                        .build())
                .toList();
        departmentRepository.saveAll(departmentList);
    }

    @Override
    @Transactional
    public void createWorcationMember(WorcationJoin worcationJoinDto) {
        Member member = Member.builder()
                .userId(worcationJoinDto.getMemberJoinDto().getUser_id())
                .userPwd(passwordEncoder.encode(worcationJoinDto.getMemberJoinDto().getUser_pwd()))
                .name(worcationJoinDto.getMemberJoinDto().getName())
                .gender(worcationJoinDto.getMemberJoinDto().getGender())
                .address(worcationJoinDto.getMemberJoinDto().getAddress())
                .birthday(worcationJoinDto.getMemberJoinDto().getBirthday())
                .email(worcationJoinDto.getMemberJoinDto().getEmail())
                .phone(worcationJoinDto.getMemberJoinDto().getPhone())
                .role(worcationJoinDto.getMemberJoinDto().getRole())
                .build();

        memberRepository.save(member);
    }

    @Override
    public String login(Login loginDto) {
        Member member = memberRepository.findByUserIdAndStatus(loginDto.getUser_id(), CommonEnums.Status.Y)
                .orElseThrow(() -> new UserAuthenticationException("존재하지 않는 사용자입니다."));
        if(!passwordEncoder.matches(loginDto.getUser_pwd(), member.getUserPwd())) {
            throw new UserAuthenticationException("비밀번호가 일치하지 않습니다.");
        }
        LoginResponse memberDto = LoginResponse.toDto(member);
        String jwtToken = jwtTokenProvider.createToken(memberDto.getUser_id(), memberDto.getRole());
        return jwtToken;
    }

    @Override
    @Transactional
    public void updateRole(Long userNo, MemberDto.UpdateRole updateRoleDto) {
        Member member = memberRepository.findById(userNo).orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
        member.updateRole(updateRoleDto.getRole());
    }

    @Override
    public InfoResponse getUserInfoByUserId() {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(()->new UserAuthenticationException("유저 정보를 찾을 수 없습니다."));
        InfoResponse infoDto = InfoResponse.toMemberDto(member);
        if(
                member.getRole().equals(Role.MANAGER) ||
                member.getRole().equals(Role.EMPLOYEE)
        ) {
            Long company_no= companyProfileRepository.getCompanyNoByUserNo(member.getUserNo())
                            .orElseThrow(() -> new CompanyNotFoundException("회사 정보를 찾을 수 없습니다."));
            infoDto.setCompany_no(company_no);
        } else if (member.getRole().equals(Role.MASTER)) {
            Long company_no = companyRepository.getCompanyNoByUserNo(member.getUserNo(), CommonEnums.Status.Y)
                    .orElseThrow(()-> new CompanyNotFoundException("회사 정보를 찾을 수 없습니다."));
            infoDto.setCompany_no(company_no);
        }
        return infoDto;
    }

    @Override
    public MemberInfoResponse getUserByUserId() {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Role role = jwtTokenProvider.getRoleFromToken();
        Member member;
        switch (role){
            case MASTER->{
                member = memberRepository.findMasterInfoByUserId(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);
                return MemberInfoResponse.toMasterDto(member);
            }
            case MANAGER, EMPLOYEE->{
                member = memberRepository.findEmployeeInfoByUserId(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);
                return MemberInfoResponse.toEmployeeDto(member);
            }
            case WORCATION, ADMIN -> {
                member = memberRepository.findWorcationInfoByUserId(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);
                return MemberInfoResponse.toWorcationDto(member);
            }
            default -> throw new UserNotFoundException();

        }
    }

    @Override
    public void checkPassword(String password) {
        String userId = jwtTokenProvider.getUserIdFromToken();
        String currentPassword = memberRepository.findUserPwdByUserId(userId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserAuthenticationException("존재하지 않는 사용자입니다."));
        if(!passwordEncoder.matches(password, currentPassword)) {
            throw new UserAuthenticationException("비밀번호가 일치하지 않습니다.");
        }
    }

    @Override
    public LoginResponse getMemberBySocialId(String socialId) {
        Member member = memberRepository.findByUserIdAndStatus(socialId, CommonEnums.Status.Y)
                .orElseThrow(() -> new UserAuthenticationException("카카오 로그인 회원 정보가 없습니다."));
        return LoginResponse.toDto(member);
    }

    @Override
    public Member createOauth(String socialId, String email, String name, SocialType socialType) {
        Member member = Member.builder()
                .email(email)
                .name(name)
                .userPwd("")
                .phone(null)
                .build();
        memberRepository.save(member);
        return member;
    }

    @Override
    @Transactional
    public void updateUser(Update updateDto) {
        String userId = jwtTokenProvider.getUserIdFromToken();
        Role role = jwtTokenProvider.getRoleFromToken();

        if(updateDto.getUser_pwd()!=null){
            String updatedPwd = passwordEncoder.encode(updateDto.getUser_pwd());
            int updatedRow = memberRepository.updatePwdByUserId(userId, updatedPwd);
            if(updatedRow == 0){
                throw new IllegalStateException("비밀번호가 변경되지 않았습니다.");
            }
        }
        switch (role){
            case WORCATION -> {
                Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);
                member.updateWorcation(updateDto);
            }
            case EMPLOYEE, MANAGER -> {
                if(updateDto.getCompany_profile_update() == null){
                    throw new NoSuchElementException("회원 정보가 부족합니다.");
                }

                Member member = memberRepository.findByUserIdWithCompanyProfile(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);
                Company changeCompany  = companyRepository.findByCompanyNoAndStatus(
                        updateDto.getCompany_profile_update().getCompany_no(),
                        CommonEnums.Status.Y
                );
                member.updateEmployee(updateDto, changeCompany);

            }
            case MASTER ->{
                if(updateDto.getCompany_update() == null){
                    throw new NoSuchElementException("회원 정보가 부족합니다.");
                }
                Member member = memberRepository.findByUserIdWithCompany(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);

                List<Department> departments = updateDto.getCompany_update().getDepartments()
                        .stream()
                        .filter(department -> department.getDepartmentNo() == null)
                        .map(department -> Department.builder()
                                .departmentNo(department.getDepartmentNo())
                                .departmentName(department.getDepartmentName())
                                .company(member.getCompany())
                            .build()
                        )
                        .toList();

                departmentRepository.saveAll(departments);

                member.updateMaster(updateDto);
                Set<Long> departmentNos = updateDto.getCompany_update().getDepartments()
                        .stream()
                        .filter(Objects::nonNull)
                        .map(Department::getDepartmentNo)
                        .collect(Collectors.toSet());

                List<Department> deletionDepartments = member.getCompany().getDepartments()
                        .stream()
                        .filter(department -> !departmentNos.contains(department.getDepartmentNo()))
                        .toList();
                departmentRepository.deleteAll(deletionDepartments);
            }
            default -> throw new IllegalStateException("Unexpected value: " + role);
        }
    }
}
