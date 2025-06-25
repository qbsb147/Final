package com.minePing.BackEnd.mapper;

import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WorcationMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(WorcationDto.Request dto, @MappingTarget Worcation entity);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateDetailFromDto(WorcationDto.Request dto, @MappingTarget WorcationDetail entity);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFeaturesFromDto(WorcationDto.Request dto, @MappingTarget WorcationFeatures entity);
    
    // 1) Request → Entity
    @Mapping(target = "worcationNo", ignore = true)
    Worcation toEntity(WorcationDto.Request dto);

    WorcationDetail toDetailEntity(WorcationDto.Request dto);

    WorcationFeatures toFeaturesEntity(WorcationDto.Request dto);

    // 2) Entity(여러 개) → Response
    @Mapping(source = "worcation.worcationNo", target = "worcationNo")
    @Mapping(source = "worcation.worcationName", target = "worcationName")
    @Mapping(source = "worcation.worcationCategory", target = "worcationCategory")
    @Mapping(source = "worcation.mainChangePhoto", target = "mainChangePhoto")
    @Mapping(source = "worcation.worcationThema", target = "worcationThema")
    @Mapping(source = "worcation.maxPeople", target = "maxPeople")
    @Mapping(source = "worcation.partnerPrice", target = "partnerPrice")
    @Mapping(source = "worcation.nonPartnerPrice", target = "nonPartnerPrice")
    @Mapping(source = "worcation.worcationAddress", target = "worcationAddress")
    @Mapping(source = "worcation.createAt", target = "createAt")
    @Mapping(source = "worcation.updateAt", target = "updateAt")
    @Mapping(source = "worcation.status", target = "status")
    @Mapping(expression = "java(worcation.getMember() != null ? worcation.getMember().getUserNo() : null)", target = "memberId")
    @Mapping(expression = "java(worcation.getSiggAreas() != null ? worcation.getSiggAreas().getId().longValue() : null)", target = "areaId")
    @Mapping(source = "detail.licensee", target = "licensee")
    @Mapping(source = "detail.businessId", target = "businessId")
    @Mapping(source = "detail.worcationTel", target = "worcationTel")
    @Mapping(source = "detail.chargeAmount", target = "chargeAmount")
    @Mapping(source = "detail.content", target = "content")
    @Mapping(source = "detail.navigate", target = "navigate")
    @Mapping(source = "detail.availableTime", target = "availableTime")
    @Mapping(source = "detail.refundPolicy", target = "refundPolicy")
    @Mapping(source = "detail.openDate", target = "openDate")
    @Mapping(source = "features.locationType", target = "locationType")
    @Mapping(source = "features.dominantColor", target = "dominantColor")
    @Mapping(source = "features.spaceMood", target = "spaceMood")
    @Mapping(source = "features.bestFor", target = "bestFor")
    @Mapping(source = "features.activities", target = "activities")
    @Mapping(source = "features.accommodationType", target = "accommodationType")
    WorcationDto.Response toResponse(Worcation worcation, WorcationDetail detail, WorcationFeatures features);
}
