package com.ssafy.api.service;

import com.ssafy.api.request.AnnouncementCreatePostReq;
import com.ssafy.api.request.AnnouncementUpdatePatchReq;
import com.ssafy.api.response.AnnouncementRes;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.common.custom.UnAuthorizedException;
import com.ssafy.db.entity.Announcement;
import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.enums.Role;
import com.ssafy.db.repository.AnnouncementRepository;
import com.ssafy.db.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final MemberService memberService;
//    private final CourseSerivce courseSerivce;
    private final CourseRepository courseRepository;
    private final CourseSerivce courseSerivce;

    @Override
    public Long createAnnouncement(
            Long memberId,
            Long courseId,
            AnnouncementCreatePostReq announcementCreatePostReq
    ) {
        if (!checkAuthority(memberId, courseId)) {
            throw new UnAuthorizedException("공지사항을 작성할 권한이 없습니다.");
        }
        Member author = memberService.getById(memberId);
//        Course course = courseService.getById(courseId);
        Course course = courseRepository.getOne(courseId);

        Announcement announcement = AnnouncementCreatePostReq.toEntity(announcementCreatePostReq, author, course);
        announcementRepository.save(announcement);

        return announcement.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public AnnouncementRes getAnnouncement(Long announcementId) {
        Announcement announcement = checkAnnouncement(announcementId);

        return AnnouncementRes.fromEntity(announcement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementRes> getAllAnnouncement(Long courseId) {
        return announcementRepository.findAllByCourseId(courseId)
                .stream()
                .map(AnnouncementRes::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementRes updateAnnouncement(
            Long memberId,
            Long courseId,
            Long announcementId,
            AnnouncementUpdatePatchReq announcementUpdatePatchReq
    ) {
        if (!checkAuthority(memberId, courseId)) {
            throw new UnAuthorizedException("공지사항을 수정할 권한이 없습니다.");
        }
        Announcement announcement = checkAnnouncement(announcementId);
        AnnouncementUpdatePatchReq.toEntity(announcement, announcementUpdatePatchReq);
        announcementRepository.save(announcement);

        return AnnouncementRes.fromEntity(announcement);
    }

    @Override
    public void deleteAnnouncement(Long memberId, Long courseId, Long announcementId) {
        if (!checkAuthority(memberId, courseId)) {
            throw new UnAuthorizedException("공지사항을 삭제할 권한이 없습니다.");
        }
        Announcement announcement = checkAnnouncement(announcementId);
        announcementRepository.delete(announcement);
    }

    //////////////////////////////////////////////////////////////////////
    private Announcement checkAnnouncement(Long announcementId){
        return announcementRepository.findById(announcementId).orElseThrow(
                () -> new NotFoundException("존재하지 않는 공지입니다")
        );
    }

    //////////////////////////////////////////////////////////////////////

    public boolean checkAuthority(Long memberId, Long courseId) {
        Member author = memberService.findById(memberId);
//        Course course = courseSerivce.findById(courseId);
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new NotFoundException("존재하지 않는 강의입니다.")
        );

        if (course.getInstructor().getId().equals(memberId) || Role.Admin.equals(author.getRole())) {
            return true;
        }
        return false;
    }
}
