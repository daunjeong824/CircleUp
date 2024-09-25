package com.ssafy.api.request;

import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class MemberSignupPostReq {
    String email;
    String pw;
    String name;
    Role role;
    String contactEmail;
    String contactTel;
    List<Long> tags;

    public static Member toEntity(MemberSignupPostReq memberSignupPostReq) {
        return Member.builder()
                .email(memberSignupPostReq.getEmail())
                .pw(memberSignupPostReq.getPw())
                .name(memberSignupPostReq.getName())
                .role(memberSignupPostReq.getRole())
                .contactTel(memberSignupPostReq.getContactTel())
                .contactEmail(memberSignupPostReq.getContactEmail())
                .build();
    }
}
