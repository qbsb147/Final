package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.PartnerDto;
import com.minePing.BackEnd.dto.PartnerDto.Response;
import java.util.List;

public interface PartnerService {
   void saveApplication(PartnerDto dto);

   List<Response> getRequestsByUser(Long userNo);
}
