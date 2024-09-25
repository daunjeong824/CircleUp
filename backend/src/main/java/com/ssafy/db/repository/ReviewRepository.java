package com.ssafy.db.repository;

import com.ssafy.db.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseId(Long courseId);

    @Query("SELECT r FROM Review r WHERE r.member.id = :memberId AND r.course.id = :courseId")
    Optional<Review> findByMemberIdAndCourseId(@Param("memberId") Long memberId, @Param("courseId") Long courseId);
}
