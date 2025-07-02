package com.minePing.BackEnd.mapper;

import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.entity.Review;
import com.minePing.BackEnd.entity.Amenity;
import com.minePing.BackEnd.entity.Photo;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WorcationMapper {
    // Worcation → Response
    @Mapping(source = "worcation.worcationNo", target = "worcation_no")
    @Mapping(source = "worcation.worcationName", target = "worcation_name")
    @Mapping(source = "worcation.worcationCategory", target = "worcation_category")
    @Mapping(source = "worcation.mainChangePhoto", target = "main_change_photo")
    @Mapping(source = "worcation.worcationThema", target = "worcation_thema")
    @Mapping(source = "worcation.maxPeople", target = "max_people")
    @Mapping(source = "worcation.partnerPrice", target = "partner_price")
    @Mapping(source = "worcation.nonPartnerPrice", target = "non_partner_price")
    @Mapping(source = "worcation.worcationAddress", target = "worcation_address")
    @Mapping(source = "worcation.createAt", target = "create_at")
    @Mapping(source = "worcation.updateAt", target = "update_at")
    @Mapping(source = "worcation.status", target = "status")
    @Mapping(expression = "java(worcation.getMember() != null ? worcation.getMember().getUserNo() : null)", target = "member_id")
    @Mapping(expression = "java(worcation.getSiggAreas() != null ? worcation.getSiggAreas().getId().longValue() : null)", target = "area_id")
    @Mapping(source = "detail.licensee", target = "licensee")
    @Mapping(source = "detail.businessId", target = "business_id")
    @Mapping(source = "detail.worcationTel", target = "worcation_tel")
    @Mapping(source = "detail.chargeAmount", target = "charge_amount")
    @Mapping(source = "detail.content", target = "content")
    @Mapping(source = "detail.navigate", target = "navigate")
    @Mapping(source = "detail.availableTime", target = "available_time")
    @Mapping(source = "detail.refundPolicy", target = "refund_policy")
    @Mapping(source = "detail.openDate", target = "open_date")
    @Mapping(source = "features.locationType", target = "location_type")
    @Mapping(source = "features.dominantColor", target = "dominant_color")
    @Mapping(source = "features.spaceMood", target = "space_mood")
    @Mapping(source = "features.bestFor", target = "best_for")
    @Mapping(source = "features.activities", target = "activities")
    @Mapping(source = "features.accommodationType", target = "accommodation_type")
    @Mapping(source = "partners", target = "partners")
    @Mapping(source = "reviews", target = "reviews")
    @Mapping(source = "amenities", target = "amenities")
    @Mapping(source = "photos", target = "photos")
    WorcationDto.Response toResponse(
            Worcation worcation,
            WorcationDetail detail, WorcationFeatures features,
            List<WorcationPartner> partners,
            List<Review> reviews,
            List<WorcationDto.AmenityResponse> amenities,
            List<WorcationDto.PhotoResponse> photos);
    
    //WorcationPartner
    @Mapping(source = "partnerNo", target = "partner_no")
    @Mapping(source = "worcation.worcationNo", target = "worcation_no")
    @Mapping(source = "member.userNo", target = "member_no")
    @Mapping(source = "company.companyNo", target = "company_no")
    @Mapping(source = "companyPeople", target = "company_people")
    @Mapping(source = "startTime", target = "start_time")
    @Mapping(source = "endTime", target = "end_time")
    @Mapping(source = "approve", target = "approve")
    @Mapping(source = "createAt", target = "create_at")
    @Mapping(source = "updateAt", target = "update_at")
    WorcationDto.PartnerResponse toPartnerResponse(
            WorcationPartner partner);

    List<WorcationDto.PartnerResponse> toPartnerResponseList(List<WorcationPartner> partners);

    
    // Amenity → AmenityResponse
    @Mapping(source = "amenityNo", target = "amenity_no")
    @Mapping(source = "amenityName", target = "amenity_name")
    WorcationDto.AmenityResponse toAmenityResponse(Amenity amenity);
    List<WorcationDto.AmenityResponse> toAmenityResponseList(List<Amenity> amenities);

    // Photo → PhotoResponse
    @Mapping(source = "photoNo", target = "photo_no")
    @Mapping(source = "changeName", target = "change_name")
    WorcationDto.PhotoResponse toPhotoResponse(Photo photo);
    List<WorcationDto.PhotoResponse> toPhotoResponseList(List<Photo> photos);


    // Review → ReviewResponse
    @Mapping(source = "reviewNo", target = "review_no")
    @Mapping(source = "worcationApplication.applicationNo", target = "application_no")
    @Mapping(source = "writerId", target = "writer_id")
    @Mapping(source = "reviewContent", target = "review_content")
    @Mapping(source = "createAt", target = "create_at")
    @Mapping(source = "updateAt", target = "update_at")
    WorcationDto.ReviewResponse toReviewResponse(Review review);

    List<WorcationDto.ReviewResponse> toReviewResponseList(List<Review> reviews);
    // Review → ReviewRequest
    Review toReviewEntity(WorcationDto.ReviewRequest dto);
}
