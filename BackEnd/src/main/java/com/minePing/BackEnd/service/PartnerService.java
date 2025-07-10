package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.PartnerDto;
import com.minePing.BackEnd.dto.PartnerDto.PartnerApproveRequestDto;
import com.minePing.BackEnd.dto.PartnerDto.Response;
import com.minePing.BackEnd.entity.WorcationPartner;
import java.util.List;

public interface PartnerService {
   void saveApplication(PartnerDto dto);
   // w 상태인 모든 제휴
   List<Response> getRequestsByUser(Long userNo);
   // y 상태인 모든 제휴
   List<Response> getApprovalRequestsByUser(Long userNo);

   WorcationPartner updateApproveStatus(Long partnerNo, PartnerApproveRequestDto dto);

}
