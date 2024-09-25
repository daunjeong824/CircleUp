package com.ssafy.db.repository;


import com.ssafy.db.entity.Course;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.Register;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.Instant;

public class CourseRepositoryImpl implements CourseRepositoryCustom {

    @PersistenceContext
    private EntityManager em;


    @Override
    @Transactional
    public boolean postRegister(Long memberId, Long courseId) {
        Member member = em.find(Member.class, memberId);
        Course course = em.find(Course.class, courseId);
        if (member == null || course == null) {
            return false;
        }

        Register register = new Register();
        register.setMember(member);
        register.setCourse(course);
        register.setCreatedAt(Timestamp.from(Instant.now()));
        em.merge(register);

        return true;
    }

    @Override
    @Transactional
    public boolean deleteRegister(Long memberId, Long courseId) {
        try {
            Register register = (Register) em.createQuery("select r from Register r where r.member.id=:memberId and r.course.id = :courseId")
                    .setParameter("memberId", memberId)
                    .setParameter("courseId", courseId).getSingleResult();

            em.remove(register);
            return true;
        } catch (NoResultException e) {
            return false;
        }
    }


}
