package com.ssafy.api.controller;

import com.ssafy.api.request.MemberUpdatePatchReq;
import com.ssafy.api.request.MemberSignupPostReq;
import com.ssafy.api.response.MemberUpdatePostRes;
import com.ssafy.api.response.MemberRes;
import com.ssafy.api.service.MemberService;
import com.ssafy.common.custom.RequiredAuth;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"멤버"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    @ApiOperation(
            value = "회원가입",
            notes = "이메일과 비밀번호를 통해 회원가입을 진행합니다<br/>별도 인증과정은 필요없습니다"
    )
    @ApiResponses(@ApiResponse(code = 404, message = "잘못된 선호 태그"))
    public ResponseEntity<Void> signup(
            @RequestBody MemberSignupPostReq memberSignupPostReq
    ) {
        memberService.signup(memberSignupPostReq);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/withdraw")
    @ApiOperation(value = "회원탈퇴")
    @RequiredAuth
    public ResponseEntity<Void> withdrawMember(
            @RequestHeader("Authorization") String token
    ) {
        memberService.withdrawMemberByToken(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @ApiOperation(
            value = "마이페이지",
            notes = "마이페이지입니다<br/>이메일, 이름 등의 정보를 조회합니다"
    )
    @ApiResponses({
            @ApiResponse(code = 401, message = "유효하지 않은 토큰"),
            @ApiResponse(code = 404, message = "회원 없음")
    })
    @RequiredAuth
    public ResponseEntity<MemberRes> readMember(
            Authentication authentication,
            @RequestHeader("Authorization") String accessToken
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok().body(memberService.getMyInfo(memberId, accessToken));
    }

    @PatchMapping("/modify")
    @ApiOperation(
            value = "회원정보수정",
            notes = "회원의 정보를 수정합니다<br/>로그인 시 아이디로 사용하는 이메일과 토큰 외의 정보를 수정할 수 있습니다"
    )
    @ApiResponses(
            @ApiResponse(code = 401, message = "유효하지 않은 토큰")
    )
    @RequiredAuth
    public ResponseEntity<MemberUpdatePostRes> updateMember(
            Authentication authentication,
            @RequestBody MemberUpdatePatchReq memberUpdatePatchReq
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        MemberUpdatePostRes memberUpdatePostRes = memberService.updateMember(memberId, memberUpdatePatchReq);
        return ResponseEntity.ok()
                .header("Authorization", memberUpdatePostRes.getAccessToken())
                .body(memberUpdatePostRes);
    }
}
