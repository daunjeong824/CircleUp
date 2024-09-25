package com.ssafy.api.controller;

import com.ssafy.api.request.AnnouncementCreatePostReq;
import com.ssafy.api.request.AnnouncementUpdatePatchReq;
import com.ssafy.api.response.AnnouncementRes;
import com.ssafy.api.service.AnnouncementService;
import com.ssafy.common.custom.RequiredAuth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "공지사항 API", tags = {"공지사항"})
@RestController
@RequestMapping("/api/courses/{courseId}/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    @ApiOperation(value = "공지사항 작성", notes = "새로운 공지사항을 작성합니다.")
    @ApiResponses({
            @ApiResponse(code = 201, message = "성공"),
            @ApiResponse(code = 400, message = "잘못된 요청"),
            @ApiResponse(code = 401, message = "인증 실패"),
    })
    @RequiredAuth
    public ResponseEntity<Long> createAnnouncement(
            Authentication authentication,
            @PathVariable Long courseId,
            @RequestBody AnnouncementCreatePostReq announcementCreatePostReq
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.status(201)
                .body(announcementService.createAnnouncement(memberId, courseId, announcementCreatePostReq));
    }

    @GetMapping("/{announcementId}")
    @ApiOperation(value = "공지사항 조회", notes = "특정 공지사항을 조회합니다.")
    @ApiResponses(
            @ApiResponse(code = 404, message = "해당 공지사항 없음")
    )
    public ResponseEntity<AnnouncementRes> getAnnouncement(
            @PathVariable(name = "announcementId") Long announcementId
    ) {
        return ResponseEntity.ok().body(announcementService.getAnnouncement(announcementId));
    }

    @GetMapping
    @ApiOperation(value = "모든 공지사항 조회", notes = "모든 공지사항을 조회합니다.")
    public ResponseEntity<List<AnnouncementRes>> getAnnouncements(
            @PathVariable(name = "courseId") Long courseId
    ) {
        return ResponseEntity.ok().body(announcementService.getAllAnnouncement(courseId));
    }

    @PatchMapping("/{announcementId}")
    @ApiOperation(value = "공지사항 수정", notes = "특정 공지사항을 수정합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "공지사항 수정 성공"),
            @ApiResponse(code = 400, message = "잘못된 요청"),
            @ApiResponse(code = 401, message = "수정 권한 없음"),
            @ApiResponse(code = 404, message = "해당 공지사항 없음")
    })
    @RequiredAuth
    public ResponseEntity<AnnouncementRes> updateAnnouncement(
            Authentication authentication,
            @RequestBody AnnouncementUpdatePatchReq announcementUpdatePatchReq,
            @PathVariable(name = "courseId") Long courseId,
            @PathVariable(name = "announcementId") Long announcementId
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok()
                .body(announcementService.updateAnnouncement(memberId, courseId, announcementId, announcementUpdatePatchReq));
    }

    @DeleteMapping("/{announcementId}")
    @ApiOperation(value = "공지사항 삭제", notes = "특정 공지사항을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "공지사항 삭제 성공"),
            @ApiResponse(code = 401, message = "삭제 권한 없음"),
            @ApiResponse(code = 404, message = "해당 공지사항 없음")
    })
    @RequiredAuth
    public ResponseEntity<Void> deleteAnnouncement(
            Authentication authentication,
            @PathVariable(name = "courseId") Long courseId,
            @PathVariable(name = "announcementId") Long announcementId
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        announcementService.deleteAnnouncement(memberId, courseId, announcementId);
        return ResponseEntity.ok().build();
    }
}
