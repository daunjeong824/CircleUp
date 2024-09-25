package com.ssafy.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberLoginPostReq {

    @ApiModelProperty(name = "아이디", example = "로그인 이메일")
    String email;

    @ApiModelProperty(name = "비밀번호", example = "비밀번호")
    String password;
}
