package com.ssafy.api.controller;

import com.ssafy.api.response.CoursesRes;
import com.ssafy.api.service.AdminService;
import com.ssafy.api.service.CourseSerivce;
import com.ssafy.common.custom.RequiredAuth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = {"강의 : 관리자(Admin)"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@RequiredAuth
public class AdminController {

    private final CourseSerivce courseService;
    private final AdminService adminService;

    @PatchMapping(value = "/course/admin/approve/{course_id}")
    @ApiOperation(value = "요청된 강의 승인 처리")
    public ResponseEntity<Void> approveCourse(
        @PathVariable(name = "course_id") Long courseId,
        Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        adminService.approveCourse(courseId, memberId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping(value = "/course/admin/reject/{course_id}")
    @ApiOperation(value = "요청된 강의 반려 처리")
    public ResponseEntity<Void> rejectCourse(
            @PathVariable(name = "course_id") Long courseId,
            Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        adminService.rejectCourse(courseId, memberId);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/course/admin/pending")
    @ApiOperation(value = "승인 요청 대기중인 강의 목록")
    public ResponseEntity<List<CoursesRes>> getPendingCourses(
            Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(courseService.getAdminPendingCourses(memberId));
    }
}
