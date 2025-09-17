package com.minePing.BackEnd.service;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.DepartmentDto;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.EmployeeJoin;
import com.minePing.BackEnd.dto.MemberDto.InfoResponse;
import com.minePing.BackEnd.dto.MemberDto.Login;
import com.minePing.BackEnd.dto.MemberDto.LoginResponse;
import com.minePing.BackEnd.dto.MemberDto.MasterJoin;
import com.minePing.BackEnd.dto.MemberDto.MemberInfoResponse;
import com.minePing.BackEnd.dto.MemberDto.Update;
import com.minePing.BackEnd.dto.MemberDto.WorcationJoin;
import com.minePing.BackEnd.dto.TempOAuthUser;
import com.minePing.BackEnd.entity.*;

import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Role;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import com.minePing.BackEnd.enums.SocialType;

import com.minePing.BackEnd.exception.CompanyNotFoundException;
import com.minePing.BackEnd.exception.UserAuthenticationException;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.repository.CompanyProfileRepository;
import com.minePing.BackEnd.repository.CompanyRepository;
import com.minePing.BackEnd.repository.DepartmentRepository;
import com.minePing.BackEnd.repository.MemberRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
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
    private final TempOAuthUserStore tempOAuthUserStore;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;
    private static final long EXPIRE_TIME = 5*60;

    @Override
    public MemberDto.init init() {
        CommonEnums.Role temp = jwtTokenProvider.getRoleFromToken();
        System.out.println("temp = " + temp);
        MemberDto.init initValue= new MemberDto.init();
        if(temp!= null && temp.equals(Role.TEMP)){
            String uuid = jwtTokenProvider.getUserIdFromToken();
            System.out.println("uuid = " + uuid);
            TempOAuthUser tempUser = tempOAuthUserStore.find(uuid)
                    .orElseThrow(() -> new RuntimeException("가입 정보가 만료되었거나 없습니다."));
            System.out.println("tempUser.getEmail() = " + tempUser.getEmail());
            System.out.println("tempUser.getName() = " + tempUser.getName());
            initValue.setUser_id(tempUser.getEmail());
            initValue.setName(tempUser.getName());
        }
        return initValue;
    }

    @Override
    @Transactional
    public void createEmployeeMember(EmployeeJoin employeeJoinDto) {
        CommonEnums.Role temp = jwtTokenProvider.getRoleFromToken();
        TempOAuthUser tempUser;
        Member member;
        if(temp!=null && temp.equals(Role.TEMP)){
            String uuid = jwtTokenProvider.getUserIdFromToken();
            tempUser = tempOAuthUserStore.find(uuid)
                    .orElseThrow(() -> new RuntimeException("가입 정보가 만료되었거나 없습니다."));
            member = Member.builder()
                    .userId(employeeJoinDto.getMemberJoinDto().getUser_id())
                    .userPwd("")
                    .name(employeeJoinDto.getMemberJoinDto().getName())
                    .gender(employeeJoinDto.getMemberJoinDto().getGender())
                    .address(employeeJoinDto.getMemberJoinDto().getAddress())
                    .birthday(employeeJoinDto.getMemberJoinDto().getBirthday())
                    .email(employeeJoinDto.getMemberJoinDto().getEmail())
                    .phone(employeeJoinDto.getMemberJoinDto().getPhone())
                    .role(employeeJoinDto.getMemberJoinDto().getRole())
                    .socialId(tempUser.getSocialId())
                    .socialType(tempUser.getSocialType())
                    .build();
        }else{
            member = Member.builder()
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
        }

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
        CommonEnums.Role temp = jwtTokenProvider.getRoleFromToken();
        TempOAuthUser tempUser;
        Member member;
        if(temp!=null && temp.equals(Role.TEMP)){
            String uuid = jwtTokenProvider.getUserIdFromToken();
            tempUser = tempOAuthUserStore.find(uuid)
                    .orElseThrow(() -> new RuntimeException("가입 정보가 만료되었거나 없습니다."));
            member = Member.builder()
                    .userId(masterJoinDto.getMemberJoinDto().getUser_id())
                    .userPwd("")
                    .name(masterJoinDto.getMemberJoinDto().getName())
                    .gender(masterJoinDto.getMemberJoinDto().getGender())
                    .address(masterJoinDto.getMemberJoinDto().getAddress())
                    .birthday(masterJoinDto.getMemberJoinDto().getBirthday())
                    .email(masterJoinDto.getMemberJoinDto().getEmail())
                    .phone(masterJoinDto.getMemberJoinDto().getPhone())
                    .role(masterJoinDto.getMemberJoinDto().getRole())
                    .socialId(tempUser.getSocialId())
                    .socialType(tempUser.getSocialType())
                    .build();
        }else{
            member = Member.builder()
                    .userId(masterJoinDto.getMemberJoinDto().getUser_id())
                    .userPwd(passwordEncoder.encode(masterJoinDto.getMemberJoinDto().getUser_pwd()))
                    .name(masterJoinDto.getMemberJoinDto().getName())
                    .gender(masterJoinDto.getMemberJoinDto().getGender())
                    .address(masterJoinDto.getMemberJoinDto().getAddress())
                    .birthday(masterJoinDto.getMemberJoinDto().getBirthday())
                    .email(masterJoinDto.getMemberJoinDto().getEmail())
                    .phone(masterJoinDto.getMemberJoinDto().getPhone())
                    .role(masterJoinDto.getMemberJoinDto().getRole())
                    .build();
        }

        Member savedMember = memberRepository.save(member);

        Company company = masterJoinDto.toCompanyEntity();
        Company savedCompany = companyRepository.save(company);

        CompanyProfile companyProfile = masterJoinDto.toCompanyProfileEntity();

        companyProfile.changeMember(savedMember);
        companyProfile.changeCompany(savedCompany);

        companyProfileRepository.save(companyProfile);

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
        CommonEnums.Role temp = jwtTokenProvider.getRoleFromToken();
        System.out.println("tempUser.getSocialId() = " + temp);
        TempOAuthUser tempUser;
        Member member;
        if(temp!=null && temp.equals(Role.TEMP)){
            String uuid = jwtTokenProvider.getUserIdFromToken();
            tempUser = tempOAuthUserStore.find(uuid)
                    .orElseThrow(() -> new RuntimeException("가입 정보가 만료되었거나 없습니다."));

            member = Member.builder()
                    .userId(worcationJoinDto.getMemberJoinDto().getUser_id())
                    .userPwd("")
                    .name(worcationJoinDto.getMemberJoinDto().getName())
                    .gender(worcationJoinDto.getMemberJoinDto().getGender())
                    .address(worcationJoinDto.getMemberJoinDto().getAddress())
                    .birthday(worcationJoinDto.getMemberJoinDto().getBirthday())
                    .email(worcationJoinDto.getMemberJoinDto().getEmail())
                    .phone(worcationJoinDto.getMemberJoinDto().getPhone())
                    .role(worcationJoinDto.getMemberJoinDto().getRole())
                    .socialId(tempUser.getSocialId())
                    .socialType(tempUser.getSocialType())
                    .build();
        }else{
            member = Member.builder()
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
        }

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
    public String updateRole(Long userNo, MemberDto.UpdateRole updateRoleDto) {
        Member newMaster = memberRepository.findById(userNo)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
        String userId = jwtTokenProvider.getUserIdFromToken();

        memberRepository.findByUserIdAndStatus(userId, Status.Y)
                .orElseThrow(()->new UserNotFoundException());
        String jwt =null;
        if (updateRoleDto.getRole() == CommonEnums.Role.MASTER) {
            Company company = newMaster.getCompanyProfile().getCompany();
            if (company == null) throw new RuntimeException("소속된 회사가 없습니다.");

//            Member currentMaster = getMember();
            Member currentMaster = memberRepository.findMaster(company.getCompanyNo(), Role.MASTER)
                    .orElseThrow(() -> new UserNotFoundException());

            if (currentMaster != null && !currentMaster.getUserNo().equals(newMaster.getUserNo())) {
                // 기존 대표는 매니저로 역할 변경
                currentMaster.updateRole(CommonEnums.Role.MANAGER);
                jwt = jwtTokenProvider.createToken(userId, Role.MANAGER);
                memberRepository.save(currentMaster);

                // 회사의 대표 멤버 변경
//                newMaster.updateRole(Role.MASTER);
                companyRepository.save(company);
            }

            newMaster.updateRole(CommonEnums.Role.MASTER);
            memberRepository.save(newMaster);
        } else {
            newMaster.updateRole(updateRoleDto.getRole());
            memberRepository.save(newMaster);
        }
        return jwt;
    }

    @Override
    public InfoResponse getUserInfoByUserId() {
        String userId = jwtTokenProvider.getUserIdFromToken();
        CommonEnums.Role role = jwtTokenProvider.getRoleFromToken();
        if(role.equals(Role.TEMP)){
            return null;
        }
        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(()->new UserAuthenticationException("유저 정보를 찾을 수 없습니다."));
        InfoResponse infoDto = InfoResponse.toMemberDto(member);
        if(
                member.getRole().equals(Role.MANAGER) ||
                member.getRole().equals(Role.EMPLOYEE)
        ) {
            CompanyProfile companyProfile = companyProfileRepository.getCompanyNoAndApproveByUserNo(member.getUserNo())
                            .orElseThrow(() -> new CompanyNotFoundException("회사 정보를 찾을 수 없습니다."));
            infoDto.setCompany_no(companyProfile.getCompany().getCompanyNo());
            infoDto.setEmployee_approve(companyProfile.getApprove());
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
                Company changeCompany;

                if(!updateDto.getCompany_profile_update().getCompany_no().equals(member.getCompanyProfile().getCompany().getCompanyNo())){
                    changeCompany  = companyRepository.findByCompanyNoAndStatus(
                            updateDto.getCompany_profile_update().getCompany_no(),
                            CommonEnums.Status.Y
                    );
                    member.getCompanyProfile().updateStatus(CommonEnums.Approve.W);
                    member.updateRole(Role.EMPLOYEE);
                    member.updateEmployee(updateDto, changeCompany);
                }

                member.updateEmployee(updateDto);
            }
            case MASTER ->{
                if(updateDto.getCompany_update() == null){
                    throw new NoSuchElementException("회원 정보가 부족합니다.");
                }

                Member member = memberRepository.findByUserIdWithCompany(userId, CommonEnums.Status.Y)
                        .orElseThrow(UserNotFoundException::new);

                Set<Long> departmentNos = updateDto.getCompany_update().getDepartments()
                        .stream()
                        .filter(Objects::nonNull)
                        .map(DepartmentDto.Request::getDepartment_no)
                        .collect(Collectors.toSet());

                List<Department> deletionDepartments = member.getCompanyProfile().getCompany().getDepartments()
                        .stream()
                        .filter(department -> !departmentNos.contains(department.getDepartmentNo()))
                        .map(department -> department.changeCompany(null))
                        .toList();

                member.getCompanyProfile().getCompany().getDepartments().removeAll(deletionDepartments);

                departmentRepository.deleteAll(deletionDepartments);

                List<Department> departments = updateDto.getCompany_update().getDepartments()
                        .stream()
                        .filter(departmentDto -> departmentDto.getDepartment_no() == null)
                        .map(departmentDto -> Department.builder()
                                .departmentName(departmentDto.getDepartment_name())
                                .company(member.getCompanyProfile().getCompany())
                            .build()
                        )
                        .toList();

                departmentRepository.saveAll(departments);

                member.updateMaster(updateDto);
                System.out.println("member.getCompanyProfile().getCompany().getCompanyName() = " + member.getCompanyProfile().getCompany().getCompanyName());
            }
            default -> throw new IllegalStateException("Unexpected value: " + role);
        }
    }

    @Override
    @Transactional
    public void delete() {
        String userId = jwtTokenProvider.getUserIdFromToken();

        Member member = memberRepository.findByUserIdAndStatus(userId, CommonEnums.Status.Y)
                .orElseThrow(UserNotFoundException::new);

        for (Worcation worcation : member.getWorcations()) {
            worcation.changeMember(null);
        }
        member.getWorcations().clear();

        for (WorcationPartner worcationPartner : member.getWorcationPartners()) {
            worcationPartner.changeMember(null);
        }
        member.getWorcationPartners().clear();
        memberRepository.delete(member);
    }

    @Override
    public void sendVerificationCode(String email) {
        try {
            String code = String.format("%06d", new Random().nextInt(999999));

            String key = "verify:"+email;
            redisTemplate.opsForValue().set(key, code, EXPIRE_TIME, TimeUnit.SECONDS);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("mineping 이메일 인증");
            message.setText("이메일 인증코드 : "+code);
            mailSender.send(message);
        } catch (Exception e) {
            // Redis나 메일 서비스가 사용 불가능한 경우 로그만 남기고 계속 진행
            System.out.println("인증 코드 전송 실패: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyCode(String email, String inputCode){
        try {
            String Key = "verify:"+email;
            String saveCode = redisTemplate.opsForValue().get(Key);
            if (saveCode == null) {
                throw new NoSuchElementException("인증 정보가 만료되었습니다.");
            }

            return inputCode.equals(saveCode);
        } catch (Exception e) {
            // Redis가 사용 불가능한 경우 false 반환
            System.out.println("인증 코드 확인 실패: " + e.getMessage());
            return false;
        }
    }
}
