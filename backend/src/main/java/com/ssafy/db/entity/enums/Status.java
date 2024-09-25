package com.ssafy.db.entity.enums;

public enum Status {
    Draft, // 승인 신청 전
    Pending, // 승인 대기
    Rejected, //  승인 거절
    Approved, // 승인 상태
    Completed; // 강의 종료

    static public Status get(String status){
        if(status.equals("Draft")) return Draft;
        else if(status.equals("Pending")) return Pending;
        else if(status.equals("Rejected")) return Rejected;
        else if(status.equals("Approved")) return Approved;
        else return Completed;
    }
}
