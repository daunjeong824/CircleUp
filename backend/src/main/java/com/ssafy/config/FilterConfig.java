package com.ssafy.config;

import com.ssafy.common.util.CustomLogoutFilter;
import com.ssafy.common.util.JwtUtil;
import com.ssafy.db.repository.MemberRepository;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<CustomLogoutFilter> logoutFilter(JwtUtil jwtUtil, MemberRepository memberRepository) {
        FilterRegistrationBean<CustomLogoutFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new CustomLogoutFilter(jwtUtil, memberRepository));
        // URL 패턴 지정
        registrationBean.addUrlPatterns("/api/auth/*");
        // 필터 체인에서의 순서 (낮을수록 먼저 실행)
        registrationBean.setOrder(1);

        return registrationBean;
    }
}