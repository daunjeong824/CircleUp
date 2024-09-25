package com.ssafy.db.entity;

import com.ssafy.db.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Member {
    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 45)
    private String email;

    @Column(length = 1000)
    private String pw;

    @Column(length = 45)
    private String name;

    @Column(name = "refresh_token", length = 1000)
    private String refreshToken;

    @Enumerated(EnumType.ORDINAL)
    private Role role;

    @Column(name = "contact_email", length = 45)
    private String contactEmail;

    @Column(name = "contact_tel", length = 45)
    private String contactTel;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favor> favors = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Register> registers = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Announcement> announcements = new ArrayList<>();

    protected Member() {
    }
}
