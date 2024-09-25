package com.ssafy.db.repository;

import com.ssafy.db.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    boolean existsByRefreshToken(String refreshToken);

    Optional<Member> findByRefreshToken(String refreshToken);
}

