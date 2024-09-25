package com.ssafy.common.util;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.ssafy.db.entity.Course;
import org.springframework.web.multipart.MultipartFile;

public class GCSUtil {
    public static final String preUrl = "https://storage.googleapis.com/circleup-bucket/";

    public static void saveCourseImg(Course course, Bucket bucket, MultipartFile img){
        try{
            String blobName = "course_" + course.getId() + "_banner";
            bucket.create(blobName, img.getBytes(), img.getContentType());

            course.setImgUrl(preUrl+blobName);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void deleteCourseImg(Long courseId, Bucket bucket){
        String blobName = "course_" + courseId + "_banner";
        Blob blob = bucket.get(blobName);
        blob.delete();
    }

    public static void updateCourseImg(Course course, Bucket bucket, MultipartFile img){
        deleteCourseImg(course.getId(), bucket);
        saveCourseImg(course, bucket, img);
    }

//    public static void saveCurrImg(Curriculum newCurr, Bucket bucket, MultipartFile img){
//        try{
//            String blobName = "curriculum_" + newCurr.getId() + "_banner";
//            bucket.create(blobName, img.getBytes(), img.getContentType());
//
//            newCurr.setImgUrl(preUrl+blobName);
//        } catch (Exception e){
//            e.printStackTrace();
//        }
//    }
//
//    public static void updateCurrImg(Curriculum curriculum, Bucket bucket, MultipartFile img){
//        deleteCurrImg(curriculum.getId(), bucket);
//        saveCurrImg(curriculum, bucket, img);
//    }
//
//    public static void deleteCurrImg(Long curriculumId, Bucket bucket){
//        String blobName = "curriculum_" + curriculumId + "_banner";
//        Blob blob = bucket.get(blobName);
//        blob.delete();
//    }
}
