package com.ssafy.api.request;

import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Curriculum;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CurriculumPostReq {
    String name;
    String description;

    public Curriculum toEntity(Course course) {
        return Curriculum.builder()
                .course(course)
                .name(this.name)
                .description(this.description)
                .indexNo(course.getCurriculumList().size()+1L)
                .build();
    }


}
