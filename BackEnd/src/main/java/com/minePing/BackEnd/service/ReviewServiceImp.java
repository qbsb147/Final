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
import com.minePing.BackEnd.mapper.WorcationMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImp implements ReviewService {

    private final WorcationMapper worcationMapper;
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
        Review saved = reviewRepository.save(review);
        return worcationMapper.toReviewResponse(saved);
    }

    @Override
    @Transactional
    public List<ReviewResponse> getReviewsByWorcation(Long worcationNo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getReviewsByWorcation'");
    }

    @Override
    @Transactional
    public ReviewResponse update(Long reviewNo, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewNo)
            .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));
        Review updated = Review.builder()
            .reviewNo(review.getReviewNo())
            .worcationApplication(review.getWorcationApplication())
            .writerId(review.getWriterId())
            .reviewContent(request.getReview_content())
            .createAt(review.getCreateAt())
            .updateAt(request.getUpdate_at())
            .build();
        Review saved = reviewRepository.save(updated);
        return worcationMapper.toReviewResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long reviewNo) {
        reviewRepository.deleteById(reviewNo);
    }
    
}
