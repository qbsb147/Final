package com.minePing.BackEnd.service;

import java.util.List;

import com.minePing.BackEnd.dto.WorcationDto;

public interface ReviewService {
    /**
     * 댓글 작성, DTO 응답 반환
     */
    WorcationDto.ReviewResponse create(WorcationDto.ReviewRequest request);

    /**
     * 워케이션 댓글 목록 조회
     */
    List<WorcationDto.ReviewResponse> getReviewsByWorcation(Long worcationNo);

    /**
     * 특정 댓글을 수정하고, 수정된 DTO 응답을 반환
     */
    WorcationDto.ReviewResponse update(Long reviewNo, WorcationDto.ReviewRequest request);

    /**
     * 특정 댓글을 삭제
     */
    void delete(Long reviewNo);

    boolean isOwner(Long reviewNo, Long userNo);
}
