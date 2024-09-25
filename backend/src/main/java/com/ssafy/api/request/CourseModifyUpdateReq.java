package com.ssafy.api.request;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.ssafy.common.custom.BadRequestException;
import com.ssafy.db.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class CourseModifyUpdateReq {
    MultipartFile img;
    String name;
    String summary;
    String price;
    String description;
    String tags;

    public List<Long> parseTags() throws Exception{
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(tags, new TypeReference<List<Long>>() {});
    }
}
