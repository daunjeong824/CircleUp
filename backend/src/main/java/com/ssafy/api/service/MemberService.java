package com.ssafy.api.service;

import com.ssafy.api.request.MemberUpdatePatchReq;
import com.ssafy.api.request.MemberSignupPostReq;
import com.ssafy.api.response.MemberUpdatePostRes;
import com.ssafy.api.response.MemberRes;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.Tag;

public interface MemberService {

    void signup(MemberSignupPostReq memberSignupPostReq);

    void withdrawMemberByToken(String token);

    MemberRes getMyInfo(Long memberId, String accessToken);

    MemberUpdatePostRes updateMember(Long memberId, MemberUpdatePatchReq memberUpdatePatchReq);

    Member getMemberByEmail(String email);

    Member findById(Long memberId);

    Member getById(Long memberId);

    void saveFavor(Member member, Tag tag);
}
