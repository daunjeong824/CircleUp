package com.ssafy.api.controller;

import com.ssafy.api.response.*;
import com.ssafy.api.service.CourseDetailService;
import com.ssafy.api.service.CourseSerivce;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Api(tags = {"강의"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CourseController {

    private final CourseSerivce courseService;
    private final CourseDetailService searchService;

    @GetMapping("/tag")
    @ApiOperation(value = "태그 목록 조회")
    public ResponseEntity<List<TagRes>> taglist() {
        return ResponseEntity.ok().body(searchService.getTagList());
    }

    @GetMapping("/courses")
    @ApiOperation(value = "강의 목록 조회", notes = "Approved 상태의 강의만 결과로 반환됩니다.")
    public ResponseEntity<List<CoursesRes>> courselist(
            @RequestParam(required = false) String type,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = true) int size) {
        if (type.equals("offer")) { // 추천순
            return ResponseEntity.ok().body(courseService.getOfferingCourses(page, size));
        } else if (type.equals("hot")) { // 인기순
            return ResponseEntity.ok().body(courseService.getCoursesByView(page, size));
        } else if (type.equals("free")) { // 무료
            return ResponseEntity.ok().body(courseService.getFreeCourses(page, size));
        } else if (type.equals("latest")) { //최신순
            return ResponseEntity.ok().body(courseService.getLatestCourses(page, size));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/courses/search")
    @ApiOperation(value = "강의 검색 결과 조회", notes = "Approved 상태의 강의만 결과로 반환됩니다.")
    public ResponseEntity<List<SearchRes>> searchResults(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, value = "tag") List<Long> tags,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = true) int size) {
        if (keyword != null) {
            // 강의 제목으로 검색
            return ResponseEntity.ok().body(courseService.getCoursesByTitle(keyword, page, size));
        } else if (tags != null) {
            // 태그 목록으로 검색
            return ResponseEntity.ok().body(courseService.getCoursesByTags(tags, page, size));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/courses/{course_id}")
    @ApiOperation(value = "강의 정보 상세 조회", notes = "요청자의 권한에 따라 접근 못하는 강의가 존재합니다.")
    @ApiResponses({
            @ApiResponse(code = 400, message = "강의에 접근 권한 없음"),
            @ApiResponse(code = 404, message = "해당 강의 없음")
    })
    public ResponseEntity<CourseRes> course(
            @PathVariable(name = "course_id") Long id
    ) {
        CourseRes courseRes = courseService.getCourseById(id);
        return ResponseEntity.ok().body(courseRes);
    }

    @GetMapping("/courses/{course_id}/owner")
    @ApiOperation(value = "강사 정보 조회")
    @ApiResponses({
            @ApiResponse(code = 404, message = "강사 없음")
    })
    public ResponseEntity<InstructorRes> owner(
            @PathVariable(name = "course_id") Long id
    ) {
        return ResponseEntity.ok().body(searchService.getInstructorByCourseId(id));
    }


    @GetMapping("/curriculums")
    @ApiOperation(value = "커리큘럼 정보 조회")
    @ApiResponses({
            @ApiResponse(code = 404, message = "커리큘럼 없음")
    })
    public ResponseEntity<List<CurriculumRes>> curriculumList(
            @RequestParam(required = false, value = "id") List<Long> ids
    ) {
        return ResponseEntity.ok().body(searchService.getCurriculumById(ids));
    }
}
