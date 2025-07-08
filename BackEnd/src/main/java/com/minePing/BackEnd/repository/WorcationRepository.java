package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorcationRepository extends JpaRepository<Worcation, Long>, WorcationRepositoryV1  {
    
    // 워케이션과 관련된 모든 정보를 한 번에 조회
    @Query("SELECT w FROM Worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdWithBasicDetails(@Param("worcationNo") Long worcationNo);
    
    // 모든 워케이션을 관련 정보와 함께 조회
    @Query("SELECT DISTINCT w FROM Worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures")
    List<Worcation> findAllWithBasicDetails();
    
    // 워케이션의 Amenities만 별도 조회
    @Query("SELECT w FROM Worcation w " +
           "LEFT JOIN FETCH w.worcationAmenities wa " +
           "LEFT JOIN FETCH wa.amenity " +
           "WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdWithAmenities(@Param("worcationNo") Long worcationNo);
    
    // 워케이션의 Photos만 별도 조회
    @Query("SELECT w FROM Worcation w " +
           "LEFT JOIN FETCH w.photos " +
           "WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdWithPhotos(@Param("worcationNo") Long worcationNo);
    
    // 워케이션의 Partners만 별도 조회
    @Query("SELECT w FROM Worcation w " +
           "LEFT JOIN FETCH w.worcationPartners " +
           "WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdWithPartners(@Param("worcationNo") Long worcationNo);
    
    // 워케이션의 Applications만 별도 조회
    @Query("SELECT w FROM Worcation w " +
           "LEFT JOIN FETCH w.worcationApplications wa " +
           "LEFT JOIN FETCH wa.review " +
           "WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdWithApplications(@Param("worcationNo") Long worcationNo);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM Worcation w WHERE w.worcationNo = :worcationNo")
    Optional<Worcation> findByIdForUpdate(@Param("worcationNo") Long worcationNo);




    List<Worcation> findByMember_UserNoAndStatus(Long userNo, CommonEnums.Status status);

    @Query("SELECT w FROM Worcation w WHERE w.member.userNo = :member")
    List<Worcation> findAllByRefWriter(@Param("member") Long member);


}
