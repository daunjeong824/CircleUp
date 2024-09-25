package com.ssafy.db.entity;

import com.google.cloud.storage.Bucket;
import com.ssafy.api.request.CourseModifyUpdateReq;
import com.ssafy.common.util.GCSUtil;
import com.ssafy.db.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Course {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    Instructor instructor;
    @Id
    @Column(name = "course_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "img_url", length = 1000)
    private String imgUrl;

    @Column
    private String name;

    @Column
    private String summary;

    @Column
    private Long view;

    @Column
    private Long price;

    @Column(length = 2000)
    private String description;

    @Column(name = "total_course")
    private Long totalCourse;

    @Column(name = "completed_course")
    private Long completedCourse;

    @Column(nullable = false)
    private double rating;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseTag> courseTagList;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Curriculum> curriculumList;

    protected Course() {
    }

    public void upView() {
        this.view = this.view + 1;
    }

    public void update(CourseModifyUpdateReq courseModifyUpdateReq, List<Tag> tagsReq, Bucket bucket){
        // 변경사항 확인 후 적용
        if (courseModifyUpdateReq.getName() != null) {
            this.setName(courseModifyUpdateReq.getName());
        }
        if (courseModifyUpdateReq.getSummary() != null) {
            this.setSummary(courseModifyUpdateReq.getSummary());
        }
        if (courseModifyUpdateReq.getPrice() != null) {
            this.setPrice(Long.parseLong(courseModifyUpdateReq.getPrice()));
        }
        if (courseModifyUpdateReq.getDescription() != null) {
            this.setDescription(courseModifyUpdateReq.getDescription());
        }
        MultipartFile img = courseModifyUpdateReq.getImg();
        if (img != null) { // 이미지는 기존꺼 삭제 후 다시 저장.. 사진 첨부 안했으면 그냥 그대로 두기
            GCSUtil.updateCourseImg(this, bucket, img);
        }

        this.courseTagList.removeIf(courseTag -> !tagsReq.contains(courseTag.getTag()));
        tagsReq.stream()
                .filter(tag -> courseTagList.stream().noneMatch(courseTag -> courseTag.getTag().equals(tag)))
                .forEach(tag -> {
                    CourseTag newCourseTag = new CourseTag();
                    newCourseTag.setCourse(this);
                    newCourseTag.setTag(tag);
                    this.courseTagList.add(newCourseTag);
                });
    }

    public void addTag(List<Tag> tagsToAdd){
        for (Tag tag : tagsToAdd) {
            CourseTag courseTag = new CourseTag();
            courseTag.setTag(tag);
            courseTag.setCourse(this);

            this.courseTagList.add(courseTag);
        }
    }
}
