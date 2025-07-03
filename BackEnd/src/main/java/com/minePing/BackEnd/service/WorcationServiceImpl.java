package com.minePing.BackEnd.service;

import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.repository.ApplicationRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minePing.BackEnd.dto.WorcationDto;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationAmenity;
import com.minePing.BackEnd.entity.WorcationDetail;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.entity.Amenity;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Photo;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.entity.Review;
import com.minePing.BackEnd.mapper.WorcationMapper;
import com.minePing.BackEnd.repository.WorcationDetailRepository;
import com.minePing.BackEnd.repository.WorcationFeaturesRepository;
import com.minePing.BackEnd.repository.WorcationRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.repository.WorcationPartnerRepository;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.exception.WorcationNotFoundException;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class WorcationServiceImpl implements WorcationService {
    //데이터 확인용 로그
    private static final Logger log = LoggerFactory.getLogger(WorcationServiceImpl.class);

    private final WorcationMapper mapper;
    private final WorcationRepository worcationRepository;
    private final WorcationDetailRepository detailRepository;
    private final WorcationFeaturesRepository featuresRepository;
    private final MemberRepository memberRepository;
    private final ApplicationRepository applicationRepository;
    private final WorcationPartnerRepository partnerRepository;
    

    @Override
    @Transactional
    public WorcationDto.Response create(WorcationDto.Request request) {
        // member_id로 Member 엔티티 조회
        Member member = memberRepository.findById(request.getMember_id())
            .orElseThrow(() -> new UserNotFoundException("해당 멤버가 없습니다: " + request.getMember_id()));

        Worcation w = Worcation.builder()
            .member(member)
            .worcationName(request.getWorcation_name())
            .worcationCategory(request.getWorcation_category())
            .mainChangePhoto(request.getMain_change_photo())
            .worcationThema(request.getWorcation_thema())
            .maxPeople(request.getMax_people())
            .partnerPrice(request.getPartner_price())
            .nonPartnerPrice(request.getNon_partner_price())
            .worcationAddress(request.getWorcation_address())
            .build();
        w = worcationRepository.save(w);

        WorcationDetail d = WorcationDetail.builder()
            .worcation(w)
            .licensee(request.getLicensee())
            .businessId(request.getBusiness_id())
            .worcationTel(request.getWorcation_tel())
            .chargeAmount(request.getCharge_amount())
            .content(request.getContent())
            .navigate(request.getNavigate())
            .availableTime(request.getAvailable_time())
            .refundPolicy(request.getRefund_policy())
            .openDate(request.getOpen_date())
            .build();
        d = detailRepository.save(d);

        WorcationFeatures f = WorcationFeatures.builder()
            .worcation(w)
            .locationType(request.getLocation_type())
            .dominantColor(request.getDominant_color())
            .spaceMood(request.getSpace_mood())
            .bestFor(request.getBest_for())
            .activities(request.getActivities())
            .accommodationType(request.getAccommodation_type())
            .build();
        f = featuresRepository.save(f);

        return mapper.toResponse(w, d, f,List.of(),List.of(),List.of(),List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public WorcationDto.Response getById(Long worcationNo) {
        Worcation w = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션을 찾을 수 없습니다: " + worcationNo));
        WorcationDetail d = detailRepository.findById(w.getWorcationNo()).orElse(null);
        WorcationFeatures f = featuresRepository.findById(w.getWorcationNo()).orElse(
            null);
        List<WorcationPartner> partners = partnerRepository.findByWorcation(w);
        //login 후 필터링 할 부분
        // List<WorcationPartner> partners = partnerRepository.findByWorcation(w).stream()
        //         .filter(partner -> "Y".equals(partner.getApprove()))
        //         .collect(Collectors.toList());
        List<Review> reviews = w.getWorcationApplications().stream()
                .map(app -> app.getReview())
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());

        List<Amenity> amenities = w.getWorcationAmenities().stream()
                .map(WorcationAmenity::getAmenity)
                .collect(Collectors.toList());
            
        List<Photo> photos = w.getPhotos();
        List<WorcationDto.AmenityResponse> amenity = mapper.toAmenityResponseList(amenities);
        List<WorcationDto.PhotoResponse> photo = mapper.toPhotoResponseList(photos);
        return mapper.toResponse(w, d, f, partners, reviews, amenity, photo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorcationDto.Response> getAll() {
        return worcationRepository.findAll().stream()
            .map(w -> {
                WorcationDetail d = detailRepository.findById(w.getWorcationNo()).orElse(null);
                WorcationFeatures f = featuresRepository.findById(w.getWorcationNo()).orElse(null);
                List<WorcationPartner> partners = partnerRepository.findByWorcation(w);
                //login 후 필터링 할 부분
                    // List<WorcationPartner> partners = partnerRepository.findByWorcation(w).stream()
                    //         .filter(partner -> "Y".equals(partner.getApprove()))
                    //         .collect(Collectors.toList());
                List<Review> reviews = w.getWorcationApplications().stream()
                    .map(app -> app.getReview())
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList());
                List<Amenity> amenities = w.getWorcationAmenities().stream()
                    .map(WorcationAmenity::getAmenity)
                    .collect(Collectors.toList());
                List<Photo> photos = w.getPhotos();
                List<WorcationDto.AmenityResponse> amenity = mapper.toAmenityResponseList(amenities);
                List<WorcationDto.PhotoResponse> photo = mapper.toPhotoResponseList(photos);
                return mapper.toResponse(w, d, f, partners, reviews, amenity, photo);
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorcationDto.Response update(Long worcationNo, WorcationDto.Request request) {
        Worcation existing = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션을 찾을 수 없습니다: " + worcationNo));
        WorcationDetail existingDetail = detailRepository.findById(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션 상세 정보를 찾을 수 없습니다: " + worcationNo));
        WorcationFeatures existingFeatures = featuresRepository.findById(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션 특징 정보를 찾을 수 없습니다: " + worcationNo));

        // Worcation 새 객체 생성 (builder)
        Worcation updatedWorcation = Worcation.builder()
            .worcationNo(existing.getWorcationNo())
            .member(existing.getMember())
            .siggAreas(existing.getSiggAreas())
            .worcationName(request.getWorcation_name() != null ? request.getWorcation_name() : existing.getWorcationName())
            .worcationCategory(request.getWorcation_category() != null ? request.getWorcation_category() : existing.getWorcationCategory())
            .mainChangePhoto(request.getMain_change_photo() != null ? request.getMain_change_photo() : existing.getMainChangePhoto())
            .worcationThema(request.getWorcation_thema() != null ? request.getWorcation_thema() : existing.getWorcationThema())
            .maxPeople(request.getMax_people() != null ? request.getMax_people() : existing.getMaxPeople())
            .partnerPrice(request.getPartner_price() != null ? request.getPartner_price() : existing.getPartnerPrice())
            .nonPartnerPrice(request.getNon_partner_price() != null ? request.getNon_partner_price() : existing.getNonPartnerPrice())
            .worcationAddress(request.getWorcation_address() != null ? request.getWorcation_address() : existing.getWorcationAddress())
            .updateAt(existing.getUpdateAt())
            .createAt(existing.getCreateAt())
            .status(existing.getStatus())
            .worcationAmenities(existing.getWorcationAmenities())
            .photos(existing.getPhotos())
            .worcationApplications(existing.getWorcationApplications())
            .worcationPartners(existing.getWorcationPartners())
            .build();

        worcationRepository.save(updatedWorcation);

        // WorcationDetail 새 객체 생성 (builder)
        WorcationDetail updatedDetail = WorcationDetail.builder()
            .worcation(updatedWorcation)
            .worcationNo(existingDetail.getWorcationNo())
            .licensee(request.getLicensee() != null ? request.getLicensee() : existingDetail.getLicensee())
            .businessId(request.getBusiness_id() != null ? request.getBusiness_id() : existingDetail.getBusinessId())
            .worcationTel(request.getWorcation_tel() != null ? request.getWorcation_tel() : existingDetail.getWorcationTel())
            .chargeAmount(request.getCharge_amount() != null ? request.getCharge_amount() : existingDetail.getChargeAmount())
            .content(request.getContent() != null ? request.getContent() : existingDetail.getContent())
            .navigate(request.getNavigate() != null ? request.getNavigate() : existingDetail.getNavigate())
            .availableTime(request.getAvailable_time() != null ? request.getAvailable_time() : existingDetail.getAvailableTime())
            .refundPolicy(request.getRefund_policy() != null ? request.getRefund_policy() : existingDetail.getRefundPolicy())
            .openDate(request.getOpen_date() != null ? request.getOpen_date() : existingDetail.getOpenDate())
            .build();
        detailRepository.save(updatedDetail);

        // WorcationFeatures 새 객체 생성 (builder)
        WorcationFeatures updatedFeatures = WorcationFeatures.builder()
            .worcation(updatedWorcation)
            .worcationNo(existingFeatures.getWorcationNo())
            .locationType(request.getLocation_type() != null ? request.getLocation_type() : existingFeatures.getLocationType())
            .dominantColor(request.getDominant_color() != null ? request.getDominant_color() : existingFeatures.getDominantColor())
            .spaceMood(request.getSpace_mood() != null ? request.getSpace_mood() : existingFeatures.getSpaceMood())
            .bestFor(request.getBest_for() != null ? request.getBest_for() : existingFeatures.getBestFor())
            .activities(request.getActivities() != null ? request.getActivities() : existingFeatures.getActivities())
            .accommodationType(request.getAccommodation_type() != null ? request.getAccommodation_type() : existingFeatures.getAccommodationType())
            .build();
        featuresRepository.save(updatedFeatures);

        return mapper.toResponse(updatedWorcation, updatedDetail, updatedFeatures, List.of(), List.of(), List.of(), List.of());
    }

    @Override
    @Transactional
    public void delete(Long worcationNo) {
        worcationRepository.deleteById(worcationNo);
    }


}