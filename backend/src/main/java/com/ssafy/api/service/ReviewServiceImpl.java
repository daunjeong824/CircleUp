package com.ssafy.api.service;

import com.ssafy.api.request.ReviewCreatePostReq;
import com.ssafy.api.request.ReviewUpdatePatchReq;
import com.ssafy.api.response.ReviewGetRes;
import com.ssafy.common.custom.ConflictException;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.common.custom.UnAuthorizedException;
import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.Review;
import com.ssafy.db.repository.CourseRepository;
import com.ssafy.db.repository.MemberRepository;
import com.ssafy.db.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberService memberService;
    private final CourseSerivce courseSerivce;
    private final CourseRepository courseRepository;

    @Override
    public Long createReview(ReviewCreatePostReq reviewCreatePostReq, Long courseId, Long memberId) {
        Member member = memberService.findById(memberId);
//        Course course = courseSerivce.findById(courseId);
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new NotFoundException("존재하지 않는 강의입니다.")
        );
        if (courseRepository.checkRegisterStatus(memberId, courseId) != 1) {
            throw new UnAuthorizedException("수강하지 않은 강의에 대해서는 리뷰를 작성할 수 없습니다.");
        }
        if (reviewRepository.findByMemberIdAndCourseId(memberId, courseId).isPresent()) {
            throw new ConflictException("이미 작성한 리뷰가 존재합니다.");
        }

        Review review = ReviewCreatePostReq.toEntity(reviewCreatePostReq, member, course);
        reviewRepository.save(review);
        calculateRating(course);

        return review.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewGetRes getReview(Long reviewId) {
        Review review = findById(reviewId);
        return ReviewGetRes.fromEntity(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewGetRes> getReviewsByCourse(Long courseId) {
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        return reviews.stream()
                .map(ReviewGetRes::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void updateReview(Long reviewId, ReviewUpdatePatchReq reviewUpdatePatchReq, Long memberId) {
        Review review = findById(reviewId);
        if (checkAuthority(memberId, review)) {
            throw new UnAuthorizedException("내가 작성하지 않은 리뷰는 수정할 수 없습니다.");
        }

        boolean isUpdated = false;
        if (reviewUpdatePatchReq.hasRatingChange()) {
            review.setRating(reviewUpdatePatchReq.getRating());
            isUpdated = true;
        }
        if (reviewUpdatePatchReq.hasContentChange()) {
            review.setContent(reviewUpdatePatchReq.getContent());
            isUpdated = true;
        }
        if (isUpdated) {
            review.setUpdatedAt(LocalDateTime.now());
            reviewRepository.save(review);
        }

        calculateRating(review.getCourse());
    }

    @Override
    public void deleteReview(Long reviewId, Long memberId) {
        Review review = findById(reviewId);
        if (checkAuthority(memberId, review)) {
            throw new UnAuthorizedException("내가 작성하지 않은 리뷰는 삭제할 수 없습니다.");
        }

        reviewRepository.delete(review);
        calculateRating(review.getCourse());
    }

    public void calculateRating(Course course) {
        List<ReviewGetRes> reviews = getReviewsByCourse(course.getId());
        Double rating = reviews.stream()
                .mapToDouble(ReviewGetRes::getRating)
                .average()
                .orElse(0.0);
        course.setRating(rating);
        courseRepository.save(course);
    }

    @Override
    @Transactional(readOnly = true)
    public Review findById(Long reviewId) {
        return reviewRepository.findById(reviewId).orElseThrow(
                () -> new NotFoundException("리뷰를 찾을 수 없습니다."));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkAuthority(Long memberId, Review review) {
        return !review.getMember().getId().equals(memberId);
    }
}
