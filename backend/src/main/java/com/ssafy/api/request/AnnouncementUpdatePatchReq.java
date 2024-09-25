package com.ssafy.api.request;

import com.ssafy.db.entity.Announcement;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AnnouncementUpdatePatchReq {
    
    @ApiModelProperty(name = "제목", example = "수정할 제목")
    String title;

    @ApiModelProperty(name = "내용", example = "수정할 내용")
    String content;

    public static void toEntity(
            Announcement announcement,
            AnnouncementUpdatePatchReq announcementUpdatePatchReq
    ) {
        announcement.setTitle(announcementUpdatePatchReq.title);
        announcement.setContent(announcementUpdatePatchReq.content);
        announcement.setUpdatedAt(LocalDateTime.now());
    }
}
