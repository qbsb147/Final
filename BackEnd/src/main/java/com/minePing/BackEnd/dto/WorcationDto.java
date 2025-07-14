package com.minePing.BackEnd.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.minePing.BackEnd.entity.Amenity;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Photo;
import com.minePing.BackEnd.entity.Review;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.WorcationEnums;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class WorcationDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        // Worcation
        private String worcation_name;
        private WorcationEnums.Category worcation_category;
        private String main_change_photo;
        private String worcation_thema;
        private Integer max_people;
        private String partner_price;
        private Integer non_partner_price;
        private String worcation_address;
        private Long member_id;
        private Long area_id;
        private CommonEnums.Status status;
        // Detail
        private String licensee;
        private String business_id;
        private String worcation_tel;
        private Integer charge_amount;
        private String content;
        private String navigate;
        private String available_time;
        private String refund_policy;
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate open_date;

        // Features
        private WorcationEnums.LocationType location_type;
        private WorcationEnums.DominantColor dominant_color;
        private WorcationEnums.SpaceMood space_mood;
        private WorcationEnums.BestFor best_for;
        private String activities;
        private WorcationEnums.AccommodationType accommodation_type;

            private List<Long> amenities;
        private List<String> photo_urls;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewRequest {
        private Long review_no;
        private Long application_no;
        private String writer_id;
        private String review_content;
        private LocalDateTime create_at;
        private LocalDateTime update_at;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewResponse {
        private Long review_no;
        private Long application_no;
        private String writer_id;
        private String review_content;
        private LocalDateTime create_at;
        private LocalDateTime update_at;

        public static ReviewResponse fromEntity(com.minePing.BackEnd.entity.Review review) {
            if (review == null)
                return null;
            return ReviewResponse.builder()
                    .review_no(review.getReviewNo())
                    .application_no(review.getWorcationApplication() != null
                            ? review.getWorcationApplication().getApplicationNo()
                            : null)
                    .writer_id(review.getWriterId())
                    .review_content(review.getReviewContent())
                    .create_at(review.getCreateAt())
                    .update_at(review.getUpdateAt())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PartnerResponse {
        private Long partner_no;
        private Long worcation_no;
        private Long member_no;
        private Long company_no;
        private Integer company_people;
        private LocalDate start_time;
        private LocalDate end_time;
        private com.minePing.BackEnd.enums.CommonEnums.Approve approve;
        private LocalDateTime create_at;
        private LocalDateTime update_at;

        public static PartnerResponse fromEntity(com.minePing.BackEnd.entity.WorcationPartner partner) {
            if (partner == null)
                return null;
            return PartnerResponse.builder()
                    .partner_no(partner.getPartnerNo())
                    .worcation_no(partner.getWorcation() != null ? partner.getWorcation().getWorcationNo() : null)
                    .member_no(partner.getMember() != null ? partner.getMember().getUserNo() : null)
                    .company_no(partner.getCompany() != null ? partner.getCompany().getCompanyNo() : null)
                    .company_people(partner.getCompanyPeople())
                    .start_time(partner.getStartTime())
                    .end_time(partner.getEndTime())
                    .approve(partner.getApprove())
                    .create_at(partner.getCreateAt())
                    .update_at(partner.getUpdateAt())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AmenityResponse {
        private Long amenity_no;
        private String amenity_name;

        public static AmenityResponse fromEntity(com.minePing.BackEnd.entity.Amenity amenity) {
            if (amenity == null)
                return null;
            return AmenityResponse.builder()
                    .amenity_no(amenity.getAmenityNo())
                    .amenity_name(amenity.getAmenityName())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PhotoResponse {
        private Long photo_no;
        private String change_name;

        public static PhotoResponse fromEntity(com.minePing.BackEnd.entity.Photo photo) {
            if (photo == null)
                return null;
            return PhotoResponse.builder()
                    .photo_no(photo.getPhotoNo())
                    .change_name(photo.getChangeName())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        // Worcation
        private Long worcation_no;
        private String worcation_name;
        private WorcationEnums.Category worcation_category;
        private String main_change_photo;
        private String worcation_thema;
        private Integer max_people;
        private String partner_price;
        private Integer non_partner_price;
        private String worcation_address;
        private LocalDateTime update_at;
        private LocalDateTime create_at;
        private CommonEnums.Status status;

        private Long member_id;
        private Long area_id;

        // Detail
        private String licensee;
        private String business_id;
        private String worcation_tel;
        private Integer charge_amount;
        private String content;
        private String navigate;
        private String available_time;
        private String refund_policy;
        private LocalDate open_date;

        // Features
        private WorcationEnums.LocationType location_type;
        private WorcationEnums.DominantColor dominant_color;
        private WorcationEnums.SpaceMood space_mood;
        private WorcationEnums.BestFor best_for;
        private String activities;
        private WorcationEnums.AccommodationType accommodation_type;

        private List<PartnerResponse> partners;
        private List<ReviewResponse> reviews;
        private List<AmenityResponse> amenities;
        private List<PhotoResponse> photos;


        public static Response fromEntity(
                Worcation w,
                WorcationDetail d,
                WorcationFeatures f,
                List<WorcationPartner> partners,
                List<Review> reviews,
                List<Amenity> amenities,
                List<Photo> photos) {
            return Response.builder()
                    .worcation_no(w.getWorcationNo())
                    .worcation_name(w.getWorcationName())
                    .worcation_category(w.getWorcationCategory())
                    .main_change_photo(w.getMainChangePhoto())
                    .worcation_thema(w.getWorcationThema())
                    .max_people(w.getMaxPeople())
                    .partner_price(w.getPartnerPrice())
                    .non_partner_price(w.getNonPartnerPrice())
                    .worcation_address(w.getWorcationAddress())
                    .update_at(w.getUpdateAt())
                    .create_at(w.getCreateAt())
                    .status(w.getStatus())
                    .member_id(w.getMember() != null ? w.getMember().getUserNo() : null)
                    .area_id(w.getSiggAreas() != null ? w.getSiggAreas().getId().longValue() : null)
                    .licensee(d != null ? d.getLicensee() : null)
                    .business_id(d != null ? d.getBusinessId() : null)
                    .worcation_tel(d != null ? d.getWorcationTel() : null)
                    .charge_amount(d != null ? d.getChargeAmount() : null)
                    .content(d != null ? d.getContent() : null)
                    .navigate(d != null ? d.getNavigate() : null)
                    .available_time(d != null ? d.getAvailableTime() : null)
                    .refund_policy(d != null ? d.getRefundPolicy() : null)
                    .open_date(d != null ? d.getOpenDate() : null)
                    .location_type(f != null ? f.getLocationType() : null)
                    .dominant_color(f != null ? f.getDominantColor() : null)
                    .space_mood(f != null ? f.getSpaceMood() : null)
                    .best_for(f != null ? f.getBestFor() : null)
                    .activities(f != null ? f.getActivities() : null)
                    .accommodation_type(f != null ? f.getAccommodationType() : null)
                    .partners(
                            partners != null ? partners.stream().map(PartnerResponse::fromEntity).toList() : List.of())
                    .reviews(reviews != null ? reviews.stream().map(ReviewResponse::fromEntity).toList() : List.of())
                    .amenities(amenities != null ? amenities.stream().map(AmenityResponse::fromEntity).toList()
                            : List.of())
                    .photos(photos != null ? photos.stream().map(PhotoResponse::fromEntity).toList() : List.of())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorcationListName{
        private String worcation_name;

        public static WorcationListName toDto(Worcation worcation){
            return WorcationListName.builder()
                    .worcation_name(worcation.getWorcationName())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleResponse {
        private Long worcation_no;
        private String name;
        private String address;
        private String theme;
        private String thumbnailUrl;

        public static SimpleResponse fromEntity(Worcation entity) {
            return SimpleResponse.builder()
                    .worcation_no(entity.getWorcationNo())
                    .name(entity.getWorcationName())
                    .address(entity.getWorcationAddress())
                    .theme(entity.getWorcationThema())
//                    .thumbnailUrl(entity.getThumbnailUrl()) // 존재하는 경우
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorcationReservation {
        private String company_name;
        private String worcation_name;
        private String user_name;
        private int age;
        private String gender;
        private String phone;
        private String company_email;
        private String worcation_date;

        public static WorcationReservation toDto(Worcation worcation, Member member, int age, Company company,
                                                 CompanyProfile companyProfile,String worcationDate) {
            return WorcationReservation.builder()
                    .company_name(company.getCompanyName())
                    .worcation_name(worcation.getWorcationName())
                    .user_name(member.getName())
                    .age(age)
                    .gender(member.getGender().name())
                    .phone(member.getPhone())
                    .company_email(companyProfile.getCompanyEmail())
                    .worcation_date(worcationDate)
                    .build();
        }
    }


        
}
