package com.ssafy.api.response;

import com.ssafy.db.entity.Review;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ApiModel("ReviewGetResponse")
public class ReviewGetRes {

    @ApiModelProperty(name = "리뷰 ID")
    private Long id;

    @ApiModelProperty(name = "사용자 ID")
    private Long memberId;

    @ApiModelProperty(name = "사용자 이름")
    private String memberName;

    @ApiModelProperty(name = "강의 ID")
    private Long courseId;

    @ApiModelProperty(name = "강의 이름")
    private String courseName;

    @ApiModelProperty(name = "별점")
    private Integer rating;

    @ApiModelProperty(name = "리뷰 내용")
    private String content;

    @ApiModelProperty(name = "등록일")
    private LocalDateTime createAt;

    @ApiModelProperty(name = "수정일")
    private LocalDateTime updateAt;

    public static ReviewGetRes fromEntity(Review review) {
        return ReviewGetRes.builder()
                .id(review.getId())
                .memberId(review.getMember().getId())
                .memberName(review.getMember().getName())
                .courseId(review.getCourse().getId())
                .courseName(review.getCourse().getName())
                .rating(review.getRating())
                .content(review.getContent())
                .createAt(review.getCreatedAt())
                .updateAt(review.getUpdatedAt())
                .build();
    }
}
