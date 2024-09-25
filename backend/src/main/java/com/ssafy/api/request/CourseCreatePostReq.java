package com.ssafy.api.request;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Instructor;
import com.ssafy.db.entity.enums.Status;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
//@ToString
public class CourseCreatePostReq {
    MultipartFile img;
    String name;
    String summary;
    String description;
    String price;
    String tags;

    public Course toEntity(Instructor instructor, Timestamp timestamp, String imgUrl) {
        return Course.builder()
                .instructor(instructor)
                .createdAt(timestamp)
                .name(this.name)
                .imgUrl(imgUrl)
                .view(0L)
                .price(Long.parseLong(price))
                .description(this.description)
                .courseTagList(new ArrayList<>())
                .curriculumList(new ArrayList<>())
                .totalCourse(0L)
                .completedCourse(0L)
                .rating(0.0)
//                .status(Status.Draft)
                .status(Status.Approved)
                .build();
    }

    public List<Long> parseTags() throws Exception{
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(tags, new TypeReference<List<Long>>() {});
    }
}
