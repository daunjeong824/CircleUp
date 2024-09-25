package com.ssafy.api.response;

import com.ssafy.db.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@AllArgsConstructor
@Setter
public class SearchRes {

    Long id;
    String imgUrl;
    String name;
    String summary;
    Long price;
    Long view;
    Long registeredCnt;
    List<String> tags;

    public static SearchRes of(Course course, Long registeredCnt, List<String> tags) {
        return new SearchRes(course.getId(),
                course.getImgUrl(),
                course.getName(),
                course.getSummary(),
                course.getPrice(),
                course.getView(),
                registeredCnt == null ? 0 : registeredCnt,
                tags
        );
    }
}
