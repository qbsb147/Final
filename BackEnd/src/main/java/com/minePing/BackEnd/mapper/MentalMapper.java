package com.minePing.BackEnd.mapper;

import com.minePing.BackEnd.dto.MentalDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Mental;
import com.minePing.BackEnd.enums.MentalEnums;
import java.time.LocalDate;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public class MentalMapper {

    public static MentalDto.Response toDto(Mental entity) {
        return MentalDto.Response.builder()
                .userNo(entity.getMember().getUserNo())
                .score(entity.getScore())
                .psychological_state(entity.getPsychologicalState().name())
                .result_content(entity.getResultContent())
                .separation(entity.getSeparation().name())
                .build();
    }

    public static Mental toEntity(MentalDto.Create dto, Member member, int score,
                                  MentalEnums.PsychologicalState state,
                                  MentalEnums.Separation separation,
                                  String resultContent) {
        return Mental.builder()
                .member(member)
                .score(score)
                .psychologicalState(state)
                .separation(separation)
                .resultContent(resultContent)
                .updateDate(LocalDate.now())
                .build();
    }
}
