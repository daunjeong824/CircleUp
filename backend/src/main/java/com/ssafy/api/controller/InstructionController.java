package com.ssafy.api.controller;

import com.ssafy.api.request.*;
import com.ssafy.api.response.CourseRes;
import com.ssafy.api.response.CoursesRes;
import com.ssafy.api.service.CourseSerivce;
import com.ssafy.api.service.InstructionService;
import com.ssafy.common.custom.RequiredAuth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Api(tags = {"강의 : 강사(Instructor)"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@RequiredAuth
public class InstructionController {

    private final CourseSerivce courseService;
    private final InstructionService instructionService;

    @GetMapping("/courses/instructions")
    @ApiOperation(value = "내가 개설한 강의 목록 조회")
    @ApiResponses({
            @ApiResponse(code = 404, message = "존재하지 않는 회원이거나 강사가 아님")
    })
    public ResponseEntity<List<CoursesRes>> madeCourses(
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(courseService.getCoursesImade(memberId));
    }

    @GetMapping(value = "/courses/instructions/{status}")
    @ApiOperation(value = "상태 별 강사의 강의 목록")
    public ResponseEntity<List<CoursesRes>> getCoursesByStatus(
            @PathVariable(name = "status") String status,
            Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(courseService.getMyCoursesByStatus(memberId, status));
    }

    @PatchMapping("/courses/instructions/request/{course_id}")
    @ApiOperation(value = "개설한 강의 승인 요청 보내기")
    public ResponseEntity<CourseRes> sendRequest(
            @PathVariable(name = "course_id") Long courseId,
            Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(instructionService.enqueueCourse(memberId, courseId));
    }

    @PatchMapping("/courses/instructions/cancelRequest/{course_id}")
    @ApiOperation(value = "개설한 강의 승인 요청 취소하기")
    public ResponseEntity<CourseRes> cancelRequest(
            @PathVariable(name = "course_id") Long courseId,
            Authentication authentication
    ){
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(instructionService.dequeueCourse(memberId, courseId));
    }

    @PostMapping(value = "/courses/instructions",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiOperation(value = "새로운 강의 만들기")
    public ResponseEntity<Long> createCourse(
            @ModelAttribute CourseCreatePostReq courseCreatePostReq,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        CourseRes course = instructionService.createCourse(courseCreatePostReq, memberId);
        return ResponseEntity.ok().body(course.getId()); // 개설한 강의 id를 반환
    }


    @PatchMapping(value = "/courses/instructions/{course_id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiOperation(value = "기존 강의 수정")
    public ResponseEntity<Void> updateCourse(
            @PathVariable(name = "course_id") Long courseId,
            @ModelAttribute CourseModifyUpdateReq courseModifyUpdateReq,
            @RequestPart(name = "img", required = false) MultipartFile img,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        instructionService.updateCourse(courseId, courseModifyUpdateReq, memberId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/courses/instructions/{course_id}")
    @ApiOperation(value = "강의 삭제", notes = "수강생이 아무도 없는 경우에만 삭제할 수 있습니다")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable(name = "course_id") Long courseId,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        instructionService.deleteCourse(courseId, memberId);
        return ResponseEntity.ok().build();
    }

    ////////////////////////////////////////////
    @PostMapping(value = "/courses/{course_id}/curriculum",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiOperation(value = "새로운 커리큘럼 만들기")
    public ResponseEntity<Long> createCurriculum(
            @PathVariable(name = "course_id") Long courseId,
            @ModelAttribute CurriculumPostReq curriculumPostReq,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        CourseRes course = instructionService.createCurriculum(curriculumPostReq, courseId, memberId);
        return ResponseEntity.ok().body(course.getId()); // 개설한 강의 id를 반환
    }

    @PatchMapping(value = "/courses/{course_id}/curriculum/{curriculum_id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "기존 커리큘럼 수정")
    public ResponseEntity<Long> updateCurriculum(
            @PathVariable(name = "course_id") Long courseId,
            @PathVariable(name = "curriculum_id") Long curriculumId,
            @ModelAttribute CurriculumUpdateReq curriculumUpdateReq,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        CourseRes course = instructionService.updateCurriculum(curriculumUpdateReq, courseId, curriculumId, memberId);

        return ResponseEntity.ok().body(course.getId());
    }

    @DeleteMapping(value = "/courses/{course_id}/curriculum/{curriculum_id}")
    @ApiOperation(value = "커리큘럼 삭제", notes = "실시간 강의 진행 전인 커리큘럼만 삭제 가능합니다.")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable(name = "course_id") Long courseId,
            @PathVariable(name = "curriculum_id") Long curriculumId,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        instructionService.deleteCurriculum(courseId, curriculumId, memberId);
        return ResponseEntity.ok().build();
    }
}
