package com.ssafy.db.repository;

public interface CourseRepositoryCustom {

    public boolean postRegister(Long memberId, Long courseId);

    public boolean deleteRegister(Long memberId, Long courseId);
}
