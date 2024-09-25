import { useEffect, useState } from "react";
import { CourseDetailInfo } from "../../types/CourseDetailInfo";
import { useLocation } from "react-router-dom";
import { tagMapping } from "../../services/tagMapping";
import { getOriginalImage, updateMyCourse } from "../../services/api";
import CourseManagementBoard from "../../components/CourseDetail/CourseManagementBoard";

const CourseManagementModify = () => {

    // useState & location으로 데이터 받기
    const location = useLocation();
    const originalCourse: CourseDetailInfo = location.state.courseDetails;
    const originalSummary: string = location.state.summary;
    const [isReady, setIsReady] = useState(false);

    const [newSummary, setNewSummary] = useState<string>("");
    const [modifiedCourses, setModifiedCourses] = useState<CourseDetailInfo>({
        id: 0,
        courseName: "",
        imgUrl: "",
        price : 0,
        imgData: null,
        instructorName: "",
        description: "",
        tags: [],
        curriculums: [],
        view: 0,
        rating: 3,
      });
    
    useEffect(() => {
        if (originalCourse) {
            setModifiedCourses(originalCourse);
            setIsReady(true);
        }
    }, [originalCourse])
    useEffect(() => {
        setNewSummary(originalSummary);
    }, [originalSummary])
    
    const updateModifiedCourse = (getCourse: CourseDetailInfo) => {
        setModifiedCourses({ ...getCourse });
    }

    const updateNewSummary = (getSummary: string) => {
        setNewSummary(getSummary);
    }
    
    const fetchOriginalImage = async () => {
        return await getOriginalImage(originalCourse.imgUrl);
    }

    const fetchModifiedCourse = async (data : FormData) => {
        try {
            const response = await updateMyCourse(modifiedCourses.id, data);
            console.log('Response : ', response.data)

            window.location.href = '/courseManagement';
        }
        catch (error) {
            console.log('error : ', error)
        }
    }

    const AddModifiedCourse = () => {
        
        const fetchInitialImgData = async () => { 
            const response = await fetchOriginalImage();
            modifiedCourses['imgData'] = response.data;
        }

        const formData = new FormData();

        if (modifiedCourses.imgData === undefined) {
            fetchInitialImgData();
        }
        else {
            for (let i = 0; i < modifiedCourses.imgData!.length ; i++)
                formData.append("img", modifiedCourses.imgData![i])
        }
        
        formData.append("name", modifiedCourses.courseName)
        formData.append("description", modifiedCourses.description)

        const numToTag: number[] = tagMapping(modifiedCourses.tags)
        formData.append("tags", JSON.stringify(numToTag))
        
        formData.append("summary", newSummary)
        formData.append("price", modifiedCourses.price.toString())
        formData.append("rating", modifiedCourses.rating.toString())

        fetchModifiedCourse(formData);
    }
    
    if (!isReady) {
        return <div>Loading....</div>
    }
    
    return (
        <div>
            <div className="flex flex-row">
                <CourseManagementBoard flag={"instructorModify"} data={modifiedCourses}
                    onNewMyCourse={updateModifiedCourse} summary={newSummary} onNewSummary={updateNewSummary} />
            </div>
            <div className="flex flex-row">
                <div className="basis-3/4 flex justify-end mr-2">
                <button
                        type="button"
                        className="
                        text-white bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:ring-blue-300 
                        font-medium 
                        rounded-lg 
                        text-sm 
                        px-5 py-2.5 me-4 mb-2 
                        dark:bg-blue-600 dark:hover:bg-blue-700 
                        focus:outline-none dark:focus:ring-blue-800
                        "
                        onClick={AddModifiedCourse}
                    >
                        Confirm
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default CourseManagementModify;