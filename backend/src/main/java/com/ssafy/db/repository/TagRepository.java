package com.ssafy.db.repository;

import com.ssafy.api.response.TagRes;
import com.ssafy.db.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("select count(t) from Tag t")
    Long getTagSize();

    @Query("select new com.ssafy.api.response.TagRes(t.id, t.name) from Tag t")
    List<TagRes> getTags();

    @Query("select t.name " +
            "from Course c " +
            "LEFT JOIN c.courseTagList ct " +
            "LEFT JOIN ct.tag t " +
            "where c.id = :courseId")
    List<String> getTagNameByCourseId(@Param("courseId") Long courseId);


}