import { useEffect, useState } from "react";
import { getSpecialCourse } from '../services/api';
import HotCourseList from "../components/List/HotCourseList";
import CourseList from "../components/List/CourseList";
import { CourseInfo } from './../types/CourseInfo';
// import { useLiveStore } from "../store/store";

const Main = () => {

    // const { setLiveCourseIds } = useLiveStore();

    const [hotCourses, setHotCourses] = useState<CourseInfo[]>([])
    const [freeCourses, setFreeCourses] = useState<CourseInfo[]>([])
    const [RecCourses, setRecCourses] = useState<CourseInfo[]>([])
    const [NewCourses, setNewCourses] = useState<CourseInfo[]>([])
    
    const fetchData = async(type: string, size: number) => {
        const data = {
            type: type,
            size: size
        }

        return await getSpecialCourse(data)
    }

    useEffect(() => {
        const fetchHotCourses = async() => {
            const response = await fetchData("hot",10);
            setHotCourses(response.data)
        }
        const fetchFreeCourses = async() => {
            const response = await fetchData("free",10);
            setFreeCourses(response.data)
        }
        const fetchRecCourses = async() => {
            const response = await fetchData("offer",10);
            setRecCourses(response.data)
        }
        const fetchNewCourses = async() => {
            const response = await fetchData("latest",10);
            setNewCourses(response.data)
        }
        fetchHotCourses()
        fetchFreeCourses()
        fetchRecCourses()
        fetchNewCourses()
        // fetchLiveCourse()
    },[])

    return (
        <div className="z-0 relative">
            {/* <Search /> */}
            <HotCourseList data={hotCourses} />
            
            <br />
            <CourseList data={freeCourses} title={"무료 강의 😃"} subTitle={"무료 강의로 원하는 강의를 신청해보세요."} />
            <CourseList data={RecCourses} title={"추천 강의 👍 "} subTitle={"추천 강의로 취향을 찾아보세요."} />
            <CourseList data={NewCourses} title={"신규 강의 👏 "} subTitle={"새로운 강의가 업데이트됐어요."} />
        </div>
    );
}

export default Main;
