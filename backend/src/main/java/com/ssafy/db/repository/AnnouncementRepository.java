package com.ssafy.db.repository;

import com.ssafy.db.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT a FROM Announcement a WHERE a.author.id = :memberId AND a.course.id = :courseId")
    Optional<Announcement> findByMemberIdAndCourseId(@Param("memberId") Long memberId, @Param("courseId") Long courseId);

    @Query("SELECT a FROM Announcement a INNER JOIN FETCH a.author WHERE a.course.id = :courseId")
    List<Announcement> findAllByCourseId(@Param("courseId") Long courseId);
}
