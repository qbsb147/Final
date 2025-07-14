package com.minePing.BackEnd.repository;



import com.minePing.BackEnd.entity.Mental;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MentalRepository extends JpaRepository<Mental, Long>,MentalRepositoryV1{

    @Query("SELECT m FROM Mental m WHERE m.member.userId = :user_Id")
    List<Mental> getMental(@Param("user_no") String user_Id);

}
