package com.minePing.BackEnd.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.minePing.BackEnd.dto.WorcationDto.ReviewRequest;
import com.minePing.BackEnd.dto.WorcationDto.ReviewResponse;
import com.minePing.BackEnd.entity.Review;
import com.minePing.BackEnd.repository.ReviewRepository;
import com.minePing.BackEnd.repository.ApplicationRepository;
import com.minePing.BackEnd.entity.WorcationApplication;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImp implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public ReviewResponse create(ReviewRequest request) {
        WorcationApplication application = applicationRepository.findById(request.getApplication_no())
            .orElseThrow(() -> new IllegalArgumentException("신청이 존재하지 않습니다."));
        Review review = Review.builder()
            .worcationApplication(application)
            .writerId(request.getWriter_id())
            .reviewContent(request.getReview_content())
            .build();
        reviewRepository.save(review);
        return ReviewResponse.fromEntity(review);
    }

    @Override
    @Transactional
    public List<ReviewResponse> getReviewsByWorcation(Long worcationNo) {
        return reviewRepository.findByWorcationNo(worcationNo)
            .stream()
            .map(ReviewResponse::fromEntity)
            .toList();
    }

    @Override
    @Transactional
    public ReviewResponse update(Long reviewNo, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewNo)
            .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));
        review.changeContent(request.getReview_content());
        return ReviewResponse.fromEntity(review);
    }

    @Override
    @Transactional
    public void delete(Long reviewNo) {
        reviewRepository.deleteById(reviewNo);
    }


    
}
