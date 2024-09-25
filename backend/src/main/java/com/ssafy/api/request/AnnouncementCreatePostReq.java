package com.ssafy.api.request;

import com.ssafy.db.entity.Announcement;
import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("AnnouncementCreatePostRequest")
public class AnnouncementCreatePostReq {

    @ApiModelProperty(name = "제목", example = "1주차 공지사항")
    private String title;

    @ApiModelProperty(name = "내용", example = "강의는 18:00시에 시작됩니다.")
    private String content;

    public static Announcement toEntity(
            AnnouncementCreatePostReq announcementCreatePostReq,
            Member member,
            Course course
    ) {
        return Announcement.builder()
                .author(member)
                .course(course)
                .title(announcementCreatePostReq.getTitle())
                .content(announcementCreatePostReq.getContent())
                .build();
    }
}
