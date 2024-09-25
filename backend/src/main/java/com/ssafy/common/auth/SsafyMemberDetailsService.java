package com.ssafy.common.auth;

import com.ssafy.api.service.MemberService;
import com.ssafy.db.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 */
@Component
public class SsafyMemberDetailsService implements UserDetailsService {

    @Autowired
    MemberService memberService;

    @Override
    public SsafyMemberDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberService.getMemberByEmail(email);
        if (member != null) {
            return new SsafyMemberDetails(member);
        }

        throw new UsernameNotFoundException("Member not found with username: " + email);
    }
}