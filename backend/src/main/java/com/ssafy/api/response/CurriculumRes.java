package com.ssafy.api.response;

import com.ssafy.db.entity.Curriculum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CurriculumRes {
    Long id;
    Long indexNo;
    String curriculumName;
    String description;

    public static CurriculumRes of(Curriculum curriculum) {
        return CurriculumRes.builder()
                .id(curriculum.getId())
                .indexNo(curriculum.getIndexNo())
                .curriculumName(curriculum.getName())
                .description(curriculum.getDescription()).build();
    }
}
