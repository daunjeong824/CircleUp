package com.ssafy.common.util;

import com.ssafy.db.entity.Member;
import com.ssafy.db.repository.MemberRepository;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class CustomLogoutFilter extends GenericFilterBean {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public CustomLogoutFilter(JwtUtil jwtUtil, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        // 경로 확인
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("/api/auth/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        // refresh 토큰 추출
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh"))
                    refresh = cookie.getValue();
            }
        }

        // refresh 토큰이 없는 경우
        if (refresh == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 유효하지 않은 경우
        if (!jwtUtil.validateToken(refresh))
            return;

        // 토큰이 refresh 인지 확인 (발급시 페이로드에 명시)
        if (!jwtUtil.isRefreshToken(refresh)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // DB에서 해당 refresh 토큰을 가진 Member 찾기
        Member member = memberRepository.findByRefreshToken(refresh).orElse(null);
        if (member == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 로그아웃 진행
        // Member의 refresh_Token을 null로 설정
        member.setRefreshToken(null);
        memberRepository.save(member);

        // refresh 토큰 Cookie 값 0
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}