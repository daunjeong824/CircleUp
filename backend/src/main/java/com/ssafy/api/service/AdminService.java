package com.ssafy.api.service;

import com.ssafy.api.response.CourseRes;
import com.ssafy.api.response.CoursesRes;
import com.ssafy.common.custom.BadRequestException;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.enums.Status;
import com.ssafy.db.entity.enums.Role;
import com.ssafy.db.repository.CourseRepository;
import com.ssafy.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final MemberRepository memberRepository;
    private final CourseRepository courseRepository;

    public CourseRes rejectCourse(Long courseId, Long memberId){
        Member admin = memberRepository.findById(memberId)
                .orElseThrow(()-> new NotFoundException("ID not found"));

        if(!admin.getRole().equals(Role.Admin)) throw new BadRequestException("Not Admin");

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));

        if(course.getStatus()!=Status.Pending) throw new BadRequestException("Status is not Pending");

        course.setStatus(Status.Rejected);
        courseRepository.save(course);

        return CourseRes.of(course);
    } // 승인 거절 for 관리자

    public CourseRes approveCourse(Long courseId, Long memberId) {
        Member admin = memberRepository.findById(memberId)
                .orElseThrow(()-> new NotFoundException("ID not found"));

        if(!admin.getRole().equals(Role.Admin)) throw new BadRequestException("Not Admin");

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));

        if(course.getStatus()!=Status.Pending) throw new BadRequestException("Status is not Pending");

        course.setStatus(Status.Approved);
        courseRepository.save(course);

        return CourseRes.of(course);
    } // 승인 for 관리자
}
