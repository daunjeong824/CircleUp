package com.ssafy.api.service;

import com.google.cloud.storage.Bucket;
import com.ssafy.api.request.*;
import com.ssafy.api.response.CourseRes;
import com.ssafy.common.custom.BadRequestException;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.common.util.GCSUtil;
import com.ssafy.db.entity.*;
import com.ssafy.db.entity.enums.Status;
import com.ssafy.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InstructionService {

    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final RegisterRepository registerRepository;
    private final TagRepository tagRepository;
    private final CurriculumRepository curriculumRepository;
    private final Bucket bucket;

    // Course 관리

    public CourseRes createCourse(CourseCreatePostReq courseCreatePostReq, Long memberId) {
        try{
            // 1. 유효성 검증
            // 요청자가 강사가 아닐때
            Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                    () -> new NotFoundException("Instructor not found")
            );
            // 빈 파일일때
            if (courseCreatePostReq.getImg() == null) {
                throw new BadRequestException("Not File");
            }
            // 이미지 파일이 아닐때
            String contentType = courseCreatePostReq.getImg().getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new BadRequestException("Not Image File");
            }

            // 2. 서비스 로직 실행
            // 현재 시간
            Timestamp timestamp = Timestamp.valueOf(LocalDateTime.now());

            Course newCourse = courseCreatePostReq.toEntity(instructor, timestamp, null);
            newCourse = courseRepository.save(newCourse);

            List<Tag> tagsToAdd = tagRepository.findAllById(courseCreatePostReq.parseTags());
            newCourse.addTag(tagsToAdd);

            // 이미지 저장
            GCSUtil.saveCourseImg(newCourse, bucket, courseCreatePostReq.getImg());
            // 3. 업데이트된 정보로 다시 저장
            return CourseRes.of(courseRepository.save(newCourse));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create course", e);
        }
    }

    public CourseRes updateCourse(Long courseId, CourseModifyUpdateReq courseModifyUpdateReq, Long memberId) {
        try {
            // 1. 유효성 검증
            Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                    () -> new NotFoundException("Instructor not found")
            );

            Course course = courseRepository.findById(courseId).orElseThrow(
                    () -> new NotFoundException("Course not found")
            );

            if (!course.getInstructor().equals(instructor)) {
                throw new BadRequestException("Instructor doesn't own the course");
            }

//            if(!course.getStatus().equals(Status.Draft) && !course.getStatus().equals(Status.Rejected)){
//                throw new BadRequestException("Status is "+course.getStatus());
//            }

            MultipartFile img = courseModifyUpdateReq.getImg();
            if (img != null) {
                String contentType = img.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) { // contentType 확인 >> img 아니면 예외처리
                    throw new BadRequestException("Not Image File");
                }
            }
            // 서비스 로직
            List<Long> tagIds = courseModifyUpdateReq.parseTags();
            List<Tag> tagsReq = tagRepository.findAllById(tagIds);
            course.update(courseModifyUpdateReq, tagsReq, bucket);

            return CourseRes.of(courseRepository.save(course));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update course", e);
        }
    }

    public void deleteCourse(Long courseId, Long memberId)  {
        // 1. 유효성 검증
        Course course = courseRepository.findById(courseId).orElseThrow(
                ()-> new NotFoundException("Course is not found")
        );

//        if(course.getStatus().equals(Status.Pending) || course.getStatus().equals(Status.Completed)){
//            throw new BadRequestException("Status is "+ course.getStatus());
//        }
//
//        if (course.getStatus().equals(Status.Approved) && registerRepository.countByCourseId(courseId) > 0) {
//            throw new BadRequestException("Registrant exists");
//        }
        if (registerRepository.countByCourseId(courseId) > 0) {
            throw new BadRequestException("Registrant exists");
        }

        Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                () -> new NotFoundException("Instructor not found")
        );

        if (!course.getInstructor().equals(instructor)) {
            throw new BadRequestException("Instructor doesn't own the course");
        }

        GCSUtil.deleteCourseImg(courseId, bucket);

        courseRepository.delete(course);
    }

    public CourseRes enqueueCourse(Long memberId, Long courseId){
        Instructor instructor = instructorRepository.findById(memberId)
                .orElseThrow(()-> new NotFoundException("Instructor not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));

        if (!course.getInstructor().equals(instructor)) {
            throw new BadRequestException("Instructor doesn't own the course");
        }

        if(course.getStatus()!=Status.Draft) throw new BadRequestException("Status is not Draft");

        course.setStatus(Status.Pending);
        courseRepository.save(course);

        return CourseRes.of(course);
    } // 강의 개설 신청 for 강사

    public CourseRes dequeueCourse(Long memberId, Long courseId){
        Instructor instructor = instructorRepository.findById(memberId)
                .orElseThrow(()-> new NotFoundException("Instructor not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found"));

        if (!course.getInstructor().equals(instructor)) {
            throw new BadRequestException("Instructor doesn't own the course");
        }

        if(course.getStatus()!=Status.Pending) throw new BadRequestException("Status is not Pending");

        course.setStatus(Status.Draft);
        courseRepository.save(course);

        return CourseRes.of(course);
    } // 강의 개설 신청 취소 for 강사

    // Curriculum 관리

    public CourseRes createCurriculum(CurriculumPostReq curriculumPostReq, Long courseId, Long memberId) {
        try {
            Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                    () -> new NotFoundException("Instructor not found")
            );

            Course course = courseRepository.findById(courseId).orElseThrow(
                    ()-> new NotFoundException("Course is not found")
            );

//            if(!course.getStatus().equals(Status.Draft) && !course.getStatus().equals(Status.Rejected)){
//                throw new BadRequestException("Status is "+course.getStatus());
//            }

            if (!course.getInstructor().equals(instructor)) {
                throw new BadRequestException("Instructor doesn't own the course");
            }


            Curriculum newCurr = curriculumPostReq.toEntity(course);

            curriculumRepository.save(newCurr);

            return CourseRes.of(course);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create curriculum", e);
        }
    }

    public CourseRes updateCurriculum(CurriculumUpdateReq curriculumUpdateReq, Long courseId, Long curriculumId, Long memberId) {
        try {
            Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                    () -> new NotFoundException("Instructor not found")
            );

            Course course = courseRepository.findById(courseId).orElseThrow(
                    ()-> new NotFoundException("Course is not found")
            );

//            if(!course.getStatus().equals(Status.Draft) && !course.getStatus().equals(Status.Rejected)){
//                throw new BadRequestException("Status is "+course.getStatus());
//            }

            if (!course.getInstructor().equals(instructor)) {
                throw new BadRequestException("Instructor doesn't own the course");
            }

            Curriculum curriculum = curriculumRepository.findById(curriculumId).orElseThrow(
                    () -> new NotFoundException("Curriculum not found")
            );



            curriculum.update(curriculumUpdateReq, bucket);
            curriculumRepository.save(curriculum);

            return CourseRes.of(course);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update curriculum", e);
        }
    }

    public void deleteCurriculum(Long courseId, Long curriculumId, Long memberId) {
        Instructor instructor = instructorRepository.findById(memberId).orElseThrow(
                () -> new NotFoundException("Instructor not found")
        );

        Course course = courseRepository.findById(courseId).orElseThrow(
                ()-> new NotFoundException("Course is not found")
        );

//        if(!course.getStatus().equals(Status.Draft) && !course.getStatus().equals(Status.Rejected)){
//            throw new BadRequestException("Status is "+course.getStatus());
//        }

        if (!course.getInstructor().equals(instructor)) {
            throw new BadRequestException("Instructor doesn't own the course");
        }

        Curriculum curriculum = curriculumRepository.findById(curriculumId).orElseThrow(
                () -> new NotFoundException("Curriculum not found")
        );

        if (curriculum.getTime() != null && curriculum.getTime() > 0) {
            throw new BadRequestException("Curriculum already done");
        }

        curriculumRepository.delete(curriculum);
        curriculumRepository.flush();

        int idxDeleted = Math.toIntExact(curriculum.getIndexNo());
        List<Curriculum> curriculumList = course.getCurriculumList();
        for(int idx = idxDeleted-1; idx<curriculumList.size(); idx++){
            Curriculum curr = curriculumList.get(idx);
            curr.setIndexNo(idx+1L);
            curriculumRepository.save(curr);
        }
    }
}
