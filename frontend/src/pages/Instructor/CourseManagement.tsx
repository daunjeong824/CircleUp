import { useEffect, useState } from "react";
import { getMyCourse } from "../../services/api";
import { CourseInfo } from "../../types/CourseInfo";
import CourseGallery from './../../components/List/CourseGallery';

const CourseManagement = () => {

    const [myCourses, setMyCourse] = useState<CourseInfo[]>([]);

    const fetchMyCourseData = async() => {
        return await getMyCourse();
    }

    const myCourseNavBar = [ '진행중인 강의' ]

    const [activeTab, setActiveTab] = useState<string>('진행중인 강의'); 

    const handleTabClick = (NavbarName: string) => {
        setActiveTab(NavbarName);
    };

    useEffect(() => {
        const fetchMyCourses = async () => {
            const response = await fetchMyCourseData();
            setMyCourse(response.data);
        }

        fetchMyCourses();
    }, []);

    // if (myCourses.length === 0)
    //     return (<div>Token 재갱신 중 || Loading...</div>);

    return (
        <div>
            {/* 메뉴 선택 Navbar */}
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-[80%] mx-auto mt-5">
                <ul className="flex flex-wrap -mb-px">
                {myCourseNavBar?.map((item, idx) => (
                    <li className="me-2" key={idx} onClick={() => handleTabClick(item)}>
                        <div
                        className={`inline-block p-4 border-b-2 rounded-t-lg text-base ${
                            activeTab === item
                            ? 'text-blue-600 border-blue-600'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        }`}
                        >
                        {item}
                        </div>
                    </li>
                ))}
                </ul>
            </div>
            <div className="w-[80%] mx-auto mt-8">
                <CourseGallery data={myCourses} ver={3}/>
            </div>
        </div>
    )
};

export default CourseManagement;