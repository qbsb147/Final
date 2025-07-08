package com.minePing.BackEnd.repository;



import com.minePing.BackEnd.entity.Mental;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MentalRepository extends JpaRepository<Mental, Long>,MentalRepositoryV1{

    @Query("SELECT m FROM Mental m WHERE m.member.userNo = :user_no")
    List<Mental> getMental(@Param("user_no") Long user_no);

}
