package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Tag {
    @Id
    @Column(name = "tag_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 45)
    private String name;

    @Column(name = "img_url", length = 2000)
    private String imgUrl;

    @OneToMany(mappedBy = "tag")
    private List<CourseTag> courseTagList = new ArrayList<>();
}
