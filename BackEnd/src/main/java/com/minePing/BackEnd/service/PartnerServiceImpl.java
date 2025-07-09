package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.PartnerDto;
import com.minePing.BackEnd.dto.PartnerDto.PartnerApproveRequestDto;
import com.minePing.BackEnd.dto.PartnerDto.Response;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.CompanyRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.PartnerRepository;
import com.minePing.BackEnd.repository.WorcationPartnerRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PartnerServiceImpl implements PartnerService {


    private final WorcationRepository worcationRepository;
    private final MemberRepository memberRepository;
    private final CompanyRepository companyRepository;
    private final PartnerRepository partnerRepository;

    @Override
    public void saveApplication(PartnerDto dto) {
        Worcation worcation = worcationRepository.findById(dto.getWorcationNo())
                .orElseThrow(() -> new IllegalArgumentException("워케이션 없음"));

        Member member = memberRepository.findById(dto.getMemberNo())
                .orElseThrow(() -> new IllegalArgumentException("멤버 없음"));

        Company company = companyRepository.findById(dto.getCompanyNo())
                .orElseThrow(() -> new IllegalArgumentException("회사 없음"));

        WorcationPartner partner = WorcationPartner.builder()
                .worcation(worcation)
                .member(member)
                .company(company)
                .companyPeople(dto.getCompanyPeople())
                .startTime(LocalDate.parse(dto.getStartDate()))
                .endTime(LocalDate.parse(dto.getEndDate()))
                .build();

        partnerRepository.save(partner);
    }


        @Override
        public List<Response> getRequestsByUser(Long userNo) {
            List<WorcationPartner> list = partnerRepository.findAllByWorcationWriter(userNo);
            return list.stream()
                    .map(PartnerDto.Response::fromEntity)
                    .collect(Collectors.toList());
        }

    @Override
    public List<Response> getApprovalRequestsByUser(Long userNo) {
        List<WorcationPartner> list = partnerRepository.findAllApprovalByWorcationWriter(userNo);
        return list.stream()
                .map(PartnerDto.Response::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public WorcationPartner updateApproveStatus(Long partnerNo, PartnerApproveRequestDto dto) {
        WorcationPartner partner = partnerRepository.findById(partnerNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 파트너가 존재하지 않습니다."));

        partner.updateStatus(dto.getApprove());
        return partnerRepository.save(partner); // 수정 후 저장 및 반환
    }


}