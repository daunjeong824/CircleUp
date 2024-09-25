package com.ssafy.api.response;

import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.enums.Role;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@ApiModel("MemberLoginPostResponse")
public class MemberLoginPostRes {
    String accessToken;
    String refreshToken;
    String name;
    String email;
    Role role;

    public static MemberLoginPostRes fromEntity(Member member, String accessToken, String refreshToken) {
        return MemberLoginPostRes.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .name(member.getName())
                .email(member.getEmail())
                .role(member.getRole())
                .build();
    }
}