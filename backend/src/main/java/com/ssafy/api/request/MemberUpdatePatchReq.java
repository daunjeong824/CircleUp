package com.ssafy.api.request;

import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class MemberUpdatePatchReq {
    String pw;
    String name;
    Role role;
    String contactEmail;
    String contactTel;
    List<Long> tags;

    public static void toEntity(
            MemberUpdatePatchReq memberUpdatePatchReq,
            Member member
    ) {
        member.setPw(memberUpdatePatchReq.getPw());
        member.setRole(memberUpdatePatchReq.getRole());
        member.setContactEmail(memberUpdatePatchReq.getContactEmail());
        member.setContactTel(memberUpdatePatchReq.getContactTel());
    }
}