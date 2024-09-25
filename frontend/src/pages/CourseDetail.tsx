import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseDetail } from '../services/api';
import { CourseDetailInfo } from '../types/CourseDetailInfo';
import CourseDetailLeftBoard from '../components/CourseDetail/CourseDetailLeftBoard';
import CourseDetailRightBoard from "../components/CourseDetail/CourseDetailRightBoard";

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const numericCourseId = Number(courseId);
    
    const [courseDetailInfoData, setCourseDetailInfoData] = useState<CourseDetailInfo | null>(null);

    const fetchDetailCourse = async () => {
        const response = await getCourseDetail(numericCourseId);
        setCourseDetailInfoData(response.data);
    }

    useEffect(() => {
        fetchDetailCourse();
    }, []);

    if (!courseDetailInfoData) {
        return <div>로딩중</div>;
    }

    return (
        <div className="flex flex-row w-[1300px] mx-auto">
            <CourseDetailLeftBoard data={courseDetailInfoData} />
            <CourseDetailRightBoard courseId={numericCourseId}  />
        </div>
    );
};

export default CourseDetail;
