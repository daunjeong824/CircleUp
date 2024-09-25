package com.ssafy.db.repository;

import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Instructor;
import com.ssafy.db.entity.enums.Status;
import org.kurento.client.internal.server.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long>, CourseRepositoryCustom {

    @Query("SELECT r.course.id, COUNT(r) FROM Register r GROUP BY r.course.id")
    List<Object[]> countRegistersByCourse();

    @EntityGraph(attributePaths = {"courseTagList", "courseTagList.tag"})
    @Query("SELECT DISTINCT c FROM Course c " +
            "WHERE (c.status = 'Approved' or c.status = 'Completed') and (c.name LIKE %:keyword% OR c.summary LIKE %:keyword%)")
    List<Course> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @EntityGraph(attributePaths = {"courseTagList", "courseTagList.tag"})
    @Query("SELECT DISTINCT c FROM Course c " +
            "WHERE (c.status = 'Approved' or c.status = 'Completed' )and c.id in (" +
            "SELECT c2.id FROM Course c2 " +
            "JOIN c2.courseTagList ct2 WHERE ct2.tag.id IN :tagIds " +
            "GROUP BY c2.id HAVING COUNT(ct2.tag.id) = :size )")
    List<Course> findByTagIds(@Param("tagIds") List<Long> tagIds, Long size, Pageable pageable);

    ///////////////////////////////////////////////////////////////////////////////

    List<Course> findByPriceAndStatus(Long price, Status status, Pageable pageable);

    List<Course> findAllByStatus(Status status, Pageable pageable);

    List<Course> findAllByStatusOrderByViewDesc(Status status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.id IN (SELECT r.course.id FROM Register r WHERE r.member.id = :memberId)")
    List<Course> findByRegisteredMemberId(@Param("memberId") Long memberId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status and c.id IN (SELECT ct.course.id FROM course_tag ct WHERE ct.tag.id = :tagId)")
    List<Course> findByTagId(@Param("tagId") Long tagId, @Param("status") Status status, Pageable pageable);

    @Query("SELECT c FROM Course c JOIN FETCH c.instructor left Join c.courseTagList WHERE c.id = :id")
    Optional<Course> findById(@Param("id") Long id);

    List<Course> findByInstructor(Instructor instructor);

    @Query("SELECT c FROM Course c WHERE c.id IN " +
            "(SELECT r.course.id FROM Register r WHERE r.member.id = :memberId)")
    List<Course> findByRegisteredMemberId(@Param("memberId") Long memberId);

    @Query("SELECT 1 FROM Register r WHERE r.member.id = :memberId AND r.course.id = :courseId")
    Long existsRegisterByMemberIdAndCourseId(@Param("memberId") Long memberId, @Param("courseId") Long courseId);

    List<Course> findAllByStatus(Status status);

    Course findByIdAndStatus(Long courseId, Status status);

    List<Course> findByStatusAndInstructorId(Status status, Long instructorId);

    @Query("SELECT CASE " +
            "WHEN c.instructor.id = :memberId THEN 2 " +
            "WHEN EXISTS (SELECT 1 FROM Register r WHERE r.member.id = :memberId AND r.course.id = :courseId) THEN 1 " +
            "ELSE 0 " +
            "END " +
            "FROM Course c " +
            "WHERE c.id = :courseId")
    Long checkRegisterStatus(@Param("memberId") Long memberId, @Param("courseId") Long courseId);

}
