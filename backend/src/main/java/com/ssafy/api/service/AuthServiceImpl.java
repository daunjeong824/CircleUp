package com.ssafy.api.service;

import com.ssafy.api.request.MemberLoginPostReq;
import com.ssafy.api.response.MemberLoginPostRes;
import com.ssafy.common.custom.BadRequestException;
import com.ssafy.common.custom.UnAuthorizedException;
import com.ssafy.common.util.JwtUtil;
import com.ssafy.db.entity.Member;
import com.ssafy.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public MemberLoginPostRes login(MemberLoginPostReq loginReq) {
        Member member = memberRepository.findByEmail(loginReq.getEmail()).orElseThrow(
                () -> new UnAuthorizedException("아이디 또는 비밀번호가 틀렸습니다")
        );
        // if (!passwordEncoder.matches(loginReq.getPassword(), member.getPw()))
        if (!member.getPw().equals(loginReq.getPassword())) {
            throw new UnAuthorizedException("아이디 또는 비밀번호가 틀렸습니다");
        }

        String accessToken = jwtUtil.generateAccessToken(member);
        String refreshToken = jwtUtil.generateRefreshToken(member.getId());

        member.setRefreshToken(refreshToken);
        memberRepository.save(member);

        return MemberLoginPostRes.fromEntity(member, accessToken, refreshToken);
    }

    @Override
    public String createNewAccessToken(String refreshToken) {
        Member member = memberRepository.findByRefreshToken(refreshToken).orElseThrow(
                () -> new BadRequestException("유효하지 않은 토큰이거나 탈퇴한 회원입니다.")
        );

        if (!jwtUtil.isTokenExpired(refreshToken)) {    // 리프레쉬 토큰이 유효하다면
            return jwtUtil.generateAccessToken(member);
        } else {    // 리프레쉬 토큰이 유효하지 않은 경우
            throw new BadRequestException("유효하지 않은 토큰이거나 탈퇴한 회원입니다.");
        }
    }
}