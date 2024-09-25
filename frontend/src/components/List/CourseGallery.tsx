import React from 'react';
import { CourseDetailInfoBySearch } from "../../types/CourseDetailInfoBySearch";
import SearchCourse from "../Card/SearchCourse";
import Course from "../Card/Course";
import { CourseInfo } from "../../types/CourseInfo";
import { useNavigate } from "react-router-dom";
import TeacherCourse from "../Card/TeacherCourse";

interface SearchCourseListProps {
    data: (CourseDetailInfoBySearch | CourseInfo)[];
    ver: number // 1 - 내 강의 페이지, 2 - 검색 목록, 3 - 강사 관리 강의
}

// 타입 가드 함수
function isCourseDetailInfoBySearch(item: CourseDetailInfoBySearch | CourseInfo): item is CourseDetailInfoBySearch {
    return (item as CourseDetailInfoBySearch).registeredCnt !== undefined;
}

function CourseGallery({ data, ver }: SearchCourseListProps) {

    const navigate = useNavigate();
    
    function handleConsole() {
        navigate(`/courseManagementMake`);
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[50px]">
            {data.map((card, idx) => (
                <div key={idx}>
                    {ver === 1 && !isCourseDetailInfoBySearch(card) && <Course data={card} bar={true} />}
                    {ver === 2 && isCourseDetailInfoBySearch(card) && <SearchCourse data={card} />}
                    {ver === 3 && !isCourseDetailInfoBySearch(card) && <TeacherCourse data={card} />}
                </div>
            ))}
            {ver === 3 &&
                <button type="button" className="w-[100px] h-[100px] m-auto text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-center"
                    onClick={handleConsole}>
                    <p>+</p>
                </button>
            }
        </div>
    );
}

export default CourseGallery;
