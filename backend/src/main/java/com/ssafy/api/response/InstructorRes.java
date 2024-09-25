package com.ssafy.api.response;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class InstructorRes {
    Long id;
    String name;
    String description;
    String contactEmail;
    String contactTel;

    protected InstructorRes() {
    }
}
