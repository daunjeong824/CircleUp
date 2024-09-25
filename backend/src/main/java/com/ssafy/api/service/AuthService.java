package com.ssafy.api.service;

import com.ssafy.api.request.MemberLoginPostReq;
import com.ssafy.api.response.MemberLoginPostRes;

public interface AuthService {

    MemberLoginPostRes login(MemberLoginPostReq loginReq);

    String createNewAccessToken(String refreshToken);
}