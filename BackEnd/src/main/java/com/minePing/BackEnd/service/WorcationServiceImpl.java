package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.WorcationDto.WorcationListName;
import com.minePing.BackEnd.dto.WorcationDto.WorcationReservation;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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
import com.minePing.BackEnd.repository.WorcationRepository;
import com.minePing.BackEnd.repository.MemberRepository;
import com.minePing.BackEnd.exception.UserNotFoundException;
import com.minePing.BackEnd.exception.WorcationNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorcationServiceImpl implements WorcationService {

    private final WorcationRepository worcationRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public WorcationDto.Response create(WorcationDto.Request request) {
        Member member = memberRepository.findById(request.getMember_id())
                .orElseThrow(() -> new UserNotFoundException("해당 멤버가 없습니다: " + request.getMember_id()));

        Worcation worcation = Worcation.builder()
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

        WorcationDetail detail = WorcationDetail.builder()
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
        detail.assignWorcation(worcation);
        worcation.assignDetail(detail);

        WorcationFeatures features = WorcationFeatures.builder()
                .worcation(worcation)
                .locationType(request.getLocation_type())
                .dominantColor(request.getDominant_color())
                .spaceMood(request.getSpace_mood())
                .bestFor(request.getBest_for())
                .activities(request.getActivities())
                .accommodationType(request.getAccommodation_type())
                .build();
        features.assignWorcation(worcation);
        worcation.assignFeatures(features);

        worcationRepository.save(worcation); // cascade 설정 시 detail, features도 자동 저장

        return WorcationDto.Response.fromEntity(worcation, detail, features, List.of(), List.of(), List.of(),
                List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public WorcationDto.Response getById(Long worcationNo) {
        // 1. 기본 정보 조회
        Worcation w = worcationRepository.findByIdWithBasicDetails(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션을 찾을 수 없습니다: " + worcationNo));

        // 2. Amenities 별도 조회
        Worcation wWithAmenities = worcationRepository.findByIdWithAmenities(worcationNo).orElse(w);

        // 3. Photos 별도 조회
        Worcation wWithPhotos = worcationRepository.findByIdWithPhotos(worcationNo).orElse(w);

        // 4. Partners 별도 조회
        Worcation wWithPartners = worcationRepository.findByIdWithPartners(worcationNo).orElse(w);

        // 5. Applications & Reviews 별도 조회
        Worcation wWithApplications = worcationRepository.findByIdWithApplications(worcationNo).orElse(w);

        // 6. 엔티티에서 관련 데이터 추출
        WorcationDetail d = w.getWorcationDetail();
        WorcationFeatures f = w.getWorcationFeatures();
        List<WorcationPartner> partners = wWithPartners.getWorcationPartners();
        List<Review> reviews = wWithApplications.getWorcationApplications().stream()
                .map(app -> app.getReview())
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());
        List<Amenity> amenities = wWithAmenities.getWorcationAmenities().stream()
                .map(WorcationAmenity::getAmenity)
                .collect(Collectors.toList());
        List<Photo> photos = wWithPhotos.getPhotos();

        return WorcationDto.Response.fromEntity(w, d, f, partners, reviews, amenities, photos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorcationDto.Response> getAll() {
        return worcationRepository.findAllWithBasicDetails().stream()
                .map(w -> {
                    // 1. 기본 정보에서 추출
                    WorcationDetail d = w.getWorcationDetail();
                    WorcationFeatures f = w.getWorcationFeatures();

                    // 2. Amenities 별도 조회
                    Worcation wWithAmenities = worcationRepository.findByIdWithAmenities(w.getWorcationNo()).orElse(w);
                    List<Amenity> amenities = wWithAmenities.getWorcationAmenities().stream()
                            .map(WorcationAmenity::getAmenity)
                            .collect(Collectors.toList());

                    // 3. Photos 별도 조회
                    Worcation wWithPhotos = worcationRepository.findByIdWithPhotos(w.getWorcationNo()).orElse(w);
                    List<Photo> photos = wWithPhotos.getPhotos();

                    // 4. Partners 별도 조회
                    Worcation wWithPartners = worcationRepository.findByIdWithPartners(w.getWorcationNo()).orElse(w);
                    List<WorcationPartner> partners = wWithPartners.getWorcationPartners();

                    // 5. Applications & Reviews 별도 조회
                    Worcation wWithApplications = worcationRepository.findByIdWithApplications(w.getWorcationNo())
                            .orElse(w);
                    List<Review> reviews = wWithApplications.getWorcationApplications().stream()
                            .map(app -> app.getReview())
                            .filter(java.util.Objects::nonNull)
                            .collect(Collectors.toList());

                    return WorcationDto.Response.fromEntity(w, d, f, partners, reviews, amenities, photos);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorcationDto.Response update(Long worcationNo, WorcationDto.Request request) {
        Worcation worcation = worcationRepository.findById(worcationNo)
                .orElseThrow(() -> new WorcationNotFoundException("워케이션을 찾을 수 없습니다: " + worcationNo));
        // 필드만 수정 (더티체킹)
        worcation.changeName(request.getWorcation_name());
        worcation.changeCategory(request.getWorcation_category());
        worcation.changeMainPhoto(request.getMain_change_photo());
        worcation.changeThema(request.getWorcation_thema());
        worcation.changeMaxPeople(request.getMax_people());
        worcation.changePartnerPrice(request.getPartner_price());
        worcation.changeNonPartnerPrice(request.getNon_partner_price());
        worcation.changeAddress(request.getWorcation_address());
        // 연관 엔티티도 필요시 수정
        WorcationDetail detail = worcation.getWorcationDetail();
        if (detail != null) {
            detail.changeLicensee(request.getLicensee());
            detail.changeBusinessId(request.getBusiness_id());
            detail.changeWorcationTel(request.getWorcation_tel());
            detail.changeChargeAmount(request.getCharge_amount());
            detail.changeContent(request.getContent());
            detail.changeNavigate(request.getNavigate());
            detail.changeAvailableTime(request.getAvailable_time());
            detail.changeRefundPolicy(request.getRefund_policy());
            detail.changeOpenDate(request.getOpen_date());
        }
        WorcationFeatures features = worcation.getWorcationFeatures();
        if (features != null) {
            features.changeLocationType(request.getLocation_type());
            features.changeDominantColor(request.getDominant_color());
            features.changeSpaceMood(request.getSpace_mood());
            features.changeBestFor(request.getBest_for());
            features.changeActivities(request.getActivities());
            features.changeAccommodationType(request.getAccommodation_type());
        }
        // save 불필요 (더티체킹)
        return WorcationDto.Response.fromEntity(worcation, detail, features, List.of(), List.of(), List.of(),
                List.of());
    }

    @Override
    @Transactional
    public void delete(Long worcationNo) {
        worcationRepository.deleteById(worcationNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorcationListName> getWorcationListName(Long userNo) {
        List<Worcation> worcations = worcationRepository.findByMember_UserNoAndStatus(
                userNo, CommonEnums.Status.Y
        );

        return worcations.stream()
                .map(WorcationListName::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<WorcationReservation> getWorcationReservation(Long userNo, Pageable pageable) {
        LocalDate today = LocalDate.now();

        Page<WorcationApplication> applications = worcationRepository.findByUserNo(userNo, pageable);

        List<WorcationReservation> content = applications.stream()
                .map(wa -> {
                    Member member = wa.getMember();
                    Worcation worcation = wa.getWorcation();
                    Company company = member.getCompany();
                    CompanyProfile companyProfile = member.getCompanyProfile();

                    int age = Period.between(member.getBirthday(), today).getYears();

                    String worcationDate = wa.getStartDate() + " ~ " + wa.getEndDate();

                    return WorcationReservation.toDto(
                            worcation, member, age, company, companyProfile, worcationDate);
                })
                .collect(Collectors.toList());

        return new org.springframework.data.domain.PageImpl<>(content, pageable, applications.getTotalElements());
    }


}