import React, { useEffect, useState } from 'react';
import { SearchCourse, getAllTages, getCourseBySearch } from "../services/api";
import { useLocation, useNavigate } from "react-router";
import { CourseDetailInfoBySearch } from '../types/CourseDetailInfoBySearch';
import { Link } from "react-router-dom";
import CourseGallery from "../components/List/CourseGallery";

interface CourseTag {
  id: number;
  tagName: string;
}

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("keyword");
  const searchTag = queryParams.get("tag");

  const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
  const [activeTab, setActiveTab] = useState<number | undefined>(); // 활성화된 탭을 관리할 상태
  const [searchCourse, setSearchCourse] = useState<CourseDetailInfoBySearch[]>([]);

  const fetchTags = async () => {
    const response = await getAllTages();
    setCourseTags(response.data);
  };

  const fetchCourseByKeyword = async (keyword: string, size: number, tag?: number) => {
    const data: SearchCourse = {
      keyword: keyword,
      size: size,
    };

    if (tag !== undefined) {
      data.tag = tag;
    }

    const response = await getCourseBySearch(data);
    setSearchCourse(response.data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    console.log(searchKeyword);
    console.log(searchTag);
    if (searchTag) {
      fetchCourseByKeyword('', 100, Number(searchTag));
      setActiveTab(Number(searchTag));
    } else {
      fetchCourseByKeyword(searchKeyword || ' ', 100);
    }
  }, [searchKeyword, searchTag]);

  const handleTabClick = (tagNumber: number) => {
    setActiveTab(tagNumber);
    navigate(`/search?tag=${tagNumber}`);
  };

  return (
    <div>
      {/* 검색 태그 선택 Navbar */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-[80%] mx-auto mt-5">
        <ul className="flex flex-wrap -mb-px">
          {courseTags?.map((item, idx) => (
            <li className="me-2" key={idx}>
              <Link to={`/search?tag=${item.id}`} onClick={() => handleTabClick(item.id)}>
                <div
                  className={`inline-block p-4 border-b-2 rounded-t-lg text-base ${
                    activeTab === item.id
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  {item.tagName}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 검색 강의 목록 */}
      <div className="w-[80%] mx-auto mt-8">
        <CourseGallery data={searchCourse} ver={2}/>
      </div>
    </div>
  );
}

export default Search;
