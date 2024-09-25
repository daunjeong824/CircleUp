package com.ssafy.common.custom;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@ApiResponses(value = {
        @ApiResponse(code = 403, message = "인증 실패")
})
@ApiImplicitParams({
        @ApiImplicitParam(name = "Authorization", value = "Bearer 로 시작하는 JWT 토큰 필요", required = false, dataTypeClass = String.class, paramType = "header")
})
public @interface RequiredAuth {
}

