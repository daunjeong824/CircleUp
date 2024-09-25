package com.ssafy.db.repository;

import com.ssafy.db.entity.Favor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavorRepository extends JpaRepository<Favor, Long> {

    List<Favor> findByMemberId(Long memberId);
}
