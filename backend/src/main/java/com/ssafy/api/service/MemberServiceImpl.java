package com.ssafy.api.service;

import com.ssafy.api.request.MemberUpdatePatchReq;
import com.ssafy.api.request.MemberSignupPostReq;
import com.ssafy.api.response.MemberUpdatePostRes;
import com.ssafy.api.response.MemberRes;
import com.ssafy.common.custom.NotFoundException;
import com.ssafy.common.custom.UnAuthorizedException;
import com.ssafy.common.util.JwtUtil;
import com.ssafy.db.entity.Favor;
import com.ssafy.db.entity.Instructor;
import com.ssafy.db.entity.Member;
import com.ssafy.db.entity.Tag;
import com.ssafy.db.entity.enums.Role;
import com.ssafy.db.repository.FavorRepository;
import com.ssafy.db.repository.InstructorRepository;
import com.ssafy.db.repository.MemberRepository;
import com.ssafy.db.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final InstructorRepository instructorRepository;
    private final TagRepository tagRepository;
    private final FavorRepository favorRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void signup(MemberSignupPostReq memberSignupPostReq) {
        Member member = MemberSignupPostReq.toEntity(memberSignupPostReq);
        // member.setPw(passwordEncoder.encode(member.getPw()));
        List<Long> tags = memberSignupPostReq.getTags();

        for (Long tagId : tags) {
            Tag tag = tagRepository.findById(tagId).orElseThrow(
                    () -> new NotFoundException("존재하지 않는 태그입니다")
            );
            saveFavor(member, tag);
        }
        if (member.getRole().equals(Role.Instructor)) {
            Instructor instructor = new Instructor();
            instructor.setId(member.getId());
            instructor.setMember(member);
            instructor.setDescription("");
            instructorRepository.save(instructor);
        }

        memberRepository.save(member);
    }

    @Override
    public void withdrawMemberByToken(String token) {
        String accessToken = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(accessToken)) {
            throw new UnAuthorizedException("Unauthorized access");
        }

        Long memberId = jwtUtil.extractId(accessToken);
        Member member = findById(memberId);
        memberRepository.delete(member);
    }

    @Override
    public MemberRes getMyInfo(Long memberId, String accessToken) {
        if (!jwtUtil.validateToken(accessToken)) {
            throw new UnAuthorizedException("Unauthorized access");
        }
        Member member = findById(memberId);
        List<Favor> favors = favorRepository.findByMemberId(member.getId());
        List<String> tagNameList = new ArrayList<>();
        for (Favor favor : favors) {
            String tagName = favor.getTag().getName();
            tagNameList.add(tagName);
        }

        return MemberRes.fromEntity(member, tagNameList);
    }

    @Override
    public MemberUpdatePostRes updateMember(Long memberId, MemberUpdatePatchReq memberUpdatePatchReq) {
        Member member = findById(memberId);
        List<Favor> favors = favorRepository.findByMemberId(member.getId());
        for (Favor favor : favors) {
            favorRepository.delete(favor);
        }

        List<Long> tags = memberUpdatePatchReq.getTags();;
        List<String> tagNameList = new ArrayList<>();
        for (Long tagId : tags) {
            Tag tag = tagRepository.findById(tagId).orElseThrow(
                    () -> new NotFoundException("Not Found Tag : Tag is " + tagId)
            );

            saveFavor(member, tag);
            tagNameList.add(tag.getName());
        }
        MemberUpdatePatchReq.toEntity(memberUpdatePatchReq, member);
        String newAccessToken = jwtUtil.generateAccessToken(member);
        String newRefreshToken = jwtUtil.generateRefreshToken(memberId);
        member.setRefreshToken(newRefreshToken);
        memberRepository.save(member);

        return MemberUpdatePostRes.fromEntity(member, newAccessToken, tagNameList);
    }

    @Override
    @Transactional(readOnly = true)
    public Member getMemberByEmail(String email) {
        return memberRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException("존재하지 않는 회원입니다."));
    }

    @Override
    @Transactional(readOnly = true)
    public Member findById(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(
                () -> new NotFoundException("존재하지 않는 회원입니다."));
    }

    @Override
    public Member getById(Long memberId) {
        return memberRepository.getOne(memberId);
    }

    @Override
    @Transactional
    public void saveFavor(Member member, Tag tag) {
        Favor favor = new Favor();
        favor.setMember(member);
        favor.setTag(tag);
        favorRepository.save(favor);
    }
}