package com.ssafy.db.repository;

import com.ssafy.api.response.InstructorRes;
import com.ssafy.db.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query("SELECT new com.ssafy.api.response.InstructorRes(" +
            "m.id, m.name, i.description, m.contactEmail, m.contactTel) from Member m " +
            "INNER JOIN Instructor i ON i.id = m.id " +
            "WHERE i.id = (SELECT c.instructor.id FROM Course c WHERE c.id = :id) ")
    Optional<InstructorRes> findInstructorByCourseId(@Param("id") Long courseId);

    @Query("SELECT c.instructor.id FROM Course c WHERE c.id = :id")
    Optional<Long> findInstructorIdByCourseId(@Param("id") Long courseId);

}
