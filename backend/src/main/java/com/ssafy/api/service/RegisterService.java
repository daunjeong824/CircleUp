package com.ssafy.api.service;

import com.ssafy.common.custom.BadRequestException;
import com.ssafy.common.custom.ConflictException;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.db.entity.enums.Status;
import com.ssafy.db.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RegisterService {

    private final CourseRepository courseRepository;

    public Long roleRegister(Long memberId, Long courseId) {
        return courseRepository.checkRegisterStatus(memberId, courseId);
    }

    public boolean existRegister(Long memberId, Long courseId) {
        return courseRepository.existsRegisterByMemberIdAndCourseId(memberId, courseId) != null;
    }

    public void doRegister(Long memberId, Long courseId) {
        // 이미 수강중이면
        if (existRegister(memberId, courseId)) {
            throw new ConflictException("Already registered");
        }

        // 강의가 열려있지 않다면
        if (courseRepository.findByIdAndStatus(courseId, Status.Approved) == null){
            throw new BadRequestException("Course is not approved");
        }

        // 수강등록 성공여부
        if (!courseRepository.postRegister(memberId, courseId)) {
            throw new NotFoundException("Not Found Course or Member");
        }
    }

    public void cancelRegister(Long memberId, Long courseId) {
        // 수강취소
        if (!courseRepository.deleteRegister(memberId, courseId)) {
            throw new BadRequestException("Not Found Course or Member or Register");
        }
    }
}
