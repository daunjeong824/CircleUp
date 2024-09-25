package com.ssafy.api.response;

import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
public class CourseRes {
    Long id;
    String courseName;
    String imgUrl;
    Long price;
    Long view;
    Double rating;
    Status status;
    String instructorName;
    String description;
    List<String> tags;
    List<Long> curriculums;


    public static CourseRes of(Course course) {
        return CourseRes.builder()
                .id(course.getId())
                .courseName(course.getName())
                .imgUrl(course.getImgUrl())
                .price(course.getPrice())
                .view(course.getView())
                .rating(course.getRating())
                .instructorName(course.getInstructor().getMember().getName())
                .description(course.getDescription())
                .status(course.getStatus())
                .tags(course.getCourseTagList().stream().map(ct -> ct.getTag().getName()).collect(Collectors.toList()))
                .curriculums(course.getCurriculumList().stream().map(curr -> curr.getId()).collect(Collectors.toList())).build();
    }
}
