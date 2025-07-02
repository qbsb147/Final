package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.WorcationDto.ReviewRequest;
import com.minePing.BackEnd.dto.WorcationDto.ReviewResponse;
import com.minePing.BackEnd.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    // 리뷰 등록
    @PostMapping
    public ResponseEntity<ReviewResponse> create(@RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.create(request));
    }

    // 워케이션별 리뷰 목록 조회
    @GetMapping("/worcation/{worcationNo}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByWorcation(@PathVariable Long worcationNo) {
        return ResponseEntity.ok(reviewService.getReviewsByWorcation(worcationNo));
    }

    // 리뷰 수정
    @PatchMapping("/{reviewNo}")
    public ResponseEntity<ReviewResponse> update(@PathVariable Long reviewNo, @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.update(reviewNo, request));
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewNo}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewNo) {
        reviewService.delete(reviewNo);
        return ResponseEntity.noContent().build();
    }
}
