package com.ssafy.api.controller;

import com.ssafy.api.request.MemberLoginPostReq;
import com.ssafy.api.response.MemberLoginPostRes;
import com.ssafy.api.service.AuthService;
import com.ssafy.common.util.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Api(tags = {"인증"})
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /////////////////////////////////////////////////////
    private final JwtUtil jwtUtil;

    @GetMapping("/jwt")
    @ApiOperation(value = "(개발용) Access Token 생성",
            notes = "<strong>유효기간 1일</strong>의 임시 토큰을 발급합니다<br/>" +
                    "이 과정에서 해당 memberId가 실제로 존재하는지는 확인하지 않습니다<br/>" +
                    "반환값은 <strong>'접두사(Bearer ) + JWT토큰'</strong>입니다")
    public String test(@RequestParam(name = "member_id") Long memberId) {
        return "Bearer "
                + jwtUtil.createToken(new HashMap<>(), memberId.toString(), 86400000L, true);
    }
    /////////////////////////////////////////////////////

    @PostMapping("/login")
    @ApiOperation(value = "로그인")
    @ApiResponses(value = {
            @ApiResponse(code = 401, message = "아이디 또는 비밀번호가 틀렸습니다")
    })
    public ResponseEntity<MemberLoginPostRes> login(
            @RequestBody MemberLoginPostReq loginReq
    ) {
        return ResponseEntity.ok().body(authService.login(loginReq));
    }

    @PostMapping("/reissue")
    @ApiOperation(value = "Access Token 재발급", notes = "Refresh Token 을 통해 새로운 Access Token을 발급합니다<br/>DB에 저장된 Refresh Token과 일치해야합니다")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "탈퇴한 회원이거나 유효하지 않는 토큰입니다"),
            @ApiResponse(code = 403, message = "유효시간이 만료된 리프레쉬 토큰입니다. 다시 로그인해주세요")
    })
    public ResponseEntity<String> reissue(
            @RequestHeader String refresh
    ) {
        return ResponseEntity.ok()
                .header("Authorization", authService.createNewAccessToken(refresh))
                .build();
    }
}