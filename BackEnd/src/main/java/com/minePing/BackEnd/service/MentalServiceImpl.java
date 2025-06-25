package com.minePing.BackEnd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.minePing.BackEnd.dto.MentalDto.Create;
import jakarta.transaction.Transactional;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MentalServiceImpl implements MentalService {

    @Override
    public void saveStressResult(Create dto) {

    }
}
