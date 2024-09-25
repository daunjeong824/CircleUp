package com.ssafy.api.controller;

import com.google.cloud.storage.Bucket;
import com.ssafy.api.service.CourseSerivce;
import com.ssafy.common.custom.RequiredAuth;
import io.openvidu.java.client.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

//@ApiIgnore
@Api(tags = {"Live"})
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final CourseSerivce courseSerivce;
    private final Bucket bucket;

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;
    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;
    @Value("${OPENVIDU_RECORDINGPATH}")
    private String OPENVIDU_RECORDINGPATH;

    private OpenVidu openvidu;


    public SessionController(CourseSerivce courseSerivce, Bucket bucket) {
        this.courseSerivce = courseSerivce;
        this.bucket = bucket;
    }

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * Live 여부 확인
     */
    @GetMapping("/{course_id}")
    @ApiOperation(value = "Live 여부 확인")
    public ResponseEntity<?> existSession(
            @PathVariable(name = "course_id") String courseId
    ) {
        return new ResponseEntity<>(openvidu.getActiveSession(courseId) == null ? false : true, HttpStatus.OK);
    }

    /**
     * Live 방 개설
     */
    @PostMapping("/{course_id}")
    @ApiResponses({
            @ApiResponse(code = 401, message = "권한 없음(해당 강의의 강사가 아니거나 탈퇴한 회원임)"),
            @ApiResponse(code = 404, message = "존재하지 않는 강의")
    })
    @RequiredAuth
    @ApiOperation(value = "Live 방 개설", notes = "강사만 본인 강의의 Live를 개설할 수 있습니다")
    public ResponseEntity<String> createSession(
            @PathVariable(name = "course_id") String courseId,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());
        if (courseSerivce.instructorInCourse(Long.valueOf(courseId), memberId)) {
            makeSession(courseId);
            return new ResponseEntity<>(courseId, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    /**
     * Live 종료
     */
    @DeleteMapping("/{course_id}")
    @RequiredAuth
    @ApiResponses({
            @ApiResponse(code = 401, message = "권한 없음"),
    })
    @ApiOperation(value = "Live 종료", notes = "강사는 라이브를 종료하고 화면녹화파일을 저장한다")
    public ResponseEntity<ArrayList<String>> sessionClose(
            @PathVariable(name = "course_id") String course_id,
            @RequestParam(name = "curriculum_id") Long curriculumId,
            Authentication authentication
    ) {
        Long courseId = Long.valueOf(course_id);
        Long memberId = Long.valueOf(authentication.getName());
        if (courseSerivce.instructorInCourse(Long.valueOf(courseId), memberId) == false) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            openvidu.stopRecording(course_id);
            openvidu.getActiveSession(course_id).close();
        } catch (Exception e) {

        } finally {
            if (!saveVideo(courseId, curriculumId)) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Live 방 접속
     */
    @PostMapping("/{course_id}/connections")
    @ApiOperation(value = "Live 방 접속", notes = "수강중인 라이브 강의로 접속할 수 있습니다")
    @ApiResponses({
            @ApiResponse(code = 401, message = "권한 없음(수강중인 회원이 아님)"),
            @ApiResponse(code = 404, message = "존재하지 않는 강의거나 라이브 강의를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "세션 생성 에러")
    })
    @RequiredAuth
    public ResponseEntity<String> createConnection(
            @PathVariable("course_id") String courseId,
            Authentication authentication
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(courseId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Long memberId = Long.valueOf(authentication.getName());
        if (courseSerivce.existRegister(memberId, Long.valueOf(courseId))
                || courseSerivce.instructorInCourse(Long.valueOf(courseId), memberId)) {
            ConnectionProperties properties = new ConnectionProperties.Builder().build();
            Connection connection = session.createConnection(properties);
            return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    /////////////////////////////////////////////////////

    /**
     * 개발용
     * Live 방 개설
     */
    @PostMapping("/dev/{course_id}")
    @ApiOperation(value = "(개발용) Live 방 개설", notes = "누구나 존재하지 않는 강의번호로 Live를 개설할 수 있습니다")
    @ApiResponses({
            @ApiResponse(code = 406, message = "사용할 수 없는 강의번호")
    })
    public ResponseEntity<String> initializeSession(
            @PathVariable(name = "course_id") String courseId
    ) {
        if (courseSerivce.existsCourse(Long.valueOf(courseId))) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        makeSession(courseId);
        return new ResponseEntity<>(courseId, HttpStatus.OK);
    }

    /**
     * 개발용
     * Live 종료
     */
    @DeleteMapping("/dev/{course_id}")
    @ApiOperation(value = "(개발용) Live 종료", notes = "라이브를 종료하고 화면녹화파일을 (로컬에) 저장한다")
    public ResponseEntity<ArrayList<String>> recordingList(
            @PathVariable("course_id") String courseId
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        openvidu.getActiveSession(courseId).close();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * 개발용
     * Live 방 접속
     */
    @PostMapping("/dev/{course_id}/connections")
    @ApiOperation(value = "(개발용) Live 방 접속", notes = "누구나 라이브 중인 강의로 접속할 수 있습니다")
    @ApiResponses({
            @ApiResponse(code = 404, message = "라이브 강의를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "세션 생성 에러")
    })
    public ResponseEntity<String> initializeConnection(
            @PathVariable("course_id") String courseId
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(courseId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ConnectionProperties properties = new ConnectionProperties.Builder().build();
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    /**
     * 개발용
     * Live 방 목록 반환
     */
    @GetMapping("/dev/courses")
    @ApiOperation(value = "(개발용) Live 방 목록", notes = "현재 라이브 중인 강의 목록을 반환합니다")
    public ResponseEntity<ArrayList<String>> sessionList(
    ) {
        ArrayList<String> sessions = new ArrayList<>();
        for (Session session : openvidu.getActiveSessions()) {
            sessions.add(session.getSessionId());
        }
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    ///////////////////////////////////////////////////// 녹화 파일 관리용

    @GetMapping("/dev/recording")
    @ApiOperation(value = "(개발용) 녹화 파일 목록", notes = "현재 저장된 녹화 파일 목록을 반환합니다")
    public ResponseEntity<?> recordingList(
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        List<Recording> recordings =
                openvidu.listRecordings();

        List<String> recordingIds = recordings.stream().map(recording -> recording.getId()).collect(Collectors.toList());
        return new ResponseEntity<>(recordingIds, HttpStatus.OK);
    }

    @PostMapping("/dev/recording")
    @ApiOperation(value = "(개발용) 녹화 중지", notes = "녹화를 중지시킵니다")
    public ResponseEntity<Void> recordingStop(
            @RequestParam(name = "course_id") String courseId
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        openvidu.stopRecording(courseId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/dev/recording")
    @ApiOperation(value = "(개발용) 녹화 삭제", notes = "녹화된 파일을 삭제합니다")
    public ResponseEntity<Void> recordingDelete(
            @RequestParam(name = "course_id") String courseId
    ) throws OpenViduJavaClientException, OpenViduHttpException {
        openvidu.deleteRecording(courseId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /////////////////////////////////////////////////////

    private String makeSession(String courseId) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("customSessionId", courseId);
            RecordingProperties recordingProperties = new RecordingProperties.Builder()
                    .outputMode(Recording.OutputMode.COMPOSED)
                    .resolution("1280x960")
                    .frameRate(48)
                    .build();
            SessionProperties properties = new SessionProperties.Builder()
                    .customSessionId(courseId).recordingMode(RecordingMode.ALWAYS).defaultRecordingProperties(recordingProperties).build();
            Session session = openvidu.createSession(properties);
            openvidu.listRecordings();
            return session.getSessionId();
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }
    }


    private Boolean saveVideo(Long courseId, Long curriculumId) {

        String originalPath = OPENVIDU_RECORDINGPATH + "/" + courseId + "/" + courseId + ".mp4";
        String fileName = UUID.randomUUID().toString() + ".mp4";

        try (InputStream inputStream = new FileInputStream(originalPath)) {
            bucket.create(fileName, inputStream, "mp4");
            courseSerivce.saveVideoUrl(fileName, curriculumId);
            openvidu.deleteRecording(courseId.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}

