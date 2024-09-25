
import { useEffect, useState } from "react";
import CourseGallery from "../../components/List/CourseGallery";
import { CourseInfo } from "../../types/CourseInfo";
import { getUserCourse } from "../../services/api";
//import { useLiveStore } from "../../store/store";

const MyCourse = () => {

    //const { setLiveCourseIds } = useLiveStore();
    const [myCourses, setMyCourses] = useState<CourseInfo[]>([]);
    
    const myCourseNavBar = [ '수강중인 강의' ]

    const [activeTab, setActiveTab] = useState<string>('수강중인 강의'); 

    const handleTabClick = (NavbarName: string) => {
        setActiveTab(NavbarName);
    };

    const handleGetMyCourse = async () => {
        const response = await getUserCourse();
        setMyCourses(response.data)
    }

    // const fetchLiveCourse = async () => {
    //     const response = await getLiveCourses();
    //     setLiveCourseIds(response.data.map((str: string) => Number(str)));
    // }

    useEffect(() => {
        handleGetMyCourse();
        // fetchLiveCourse();
    }, [])

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
                <CourseGallery data={myCourses} ver={1}/>
            </div>
        </div>

    );
};

export default MyCourse;
