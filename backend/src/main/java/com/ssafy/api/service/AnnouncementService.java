package com.ssafy.api.service;

import com.ssafy.api.request.AnnouncementCreatePostReq;
import com.ssafy.api.request.AnnouncementUpdatePatchReq;
import com.ssafy.api.response.AnnouncementRes;

import java.util.List;

public interface AnnouncementService {

    Long createAnnouncement(Long memberId, Long courseId, AnnouncementCreatePostReq announcementCreatePostReq);

    AnnouncementRes getAnnouncement(Long announcementId);

    List<AnnouncementRes> getAllAnnouncement(Long courseId);

    AnnouncementRes updateAnnouncement(Long memberId, Long courseId, Long announcementId, AnnouncementUpdatePatchReq announcementUpdatePatchReq);

    void deleteAnnouncement(Long memberId, Long courseId, Long announcementId);
}
