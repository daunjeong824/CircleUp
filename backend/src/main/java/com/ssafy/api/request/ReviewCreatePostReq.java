package com.ssafy.api.request;

import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.Review;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@ApiModel("ReviewCreatePostRequest")
public class ReviewCreatePostReq {

    @ApiModelProperty(name = "별점", example = "5")
    private Integer rating;

    @ApiModelProperty(name = "리뷰 내용", example = "최고의 강의에요!")
    private String content;

    public static Review toEntity(
            ReviewCreatePostReq reviewCreatePostReq,
            Member member,
            Course course
    ) {
        return Review.builder()
                .member(member)
                .course(course)
                .rating(reviewCreatePostReq.getRating())
                .content(reviewCreatePostReq.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .isDeleted(false)
                .helpfulCount(0)
                .reportCount(0)
                .build();
    }
}
