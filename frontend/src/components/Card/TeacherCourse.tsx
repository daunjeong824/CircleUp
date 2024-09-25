import { CourseInfo } from "../../types/CourseInfo";
import { Link } from "react-router-dom";

// props
interface TeacherCourseProps {
    data : CourseInfo
}

const TeacherCourse = ({ data } : TeacherCourseProps) => {

    const { imgUrl, id: courseId, name, summary } = data;
    
    const maxSummaryLength = 50;
    const shortenedSummary =
      summary.length > maxSummaryLength
        ? `${data.summary.slice(0, maxSummaryLength)}...`
        : summary;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 mx-auto items-center dark:border-gray-700 w-[220px]">
            <Link to={`/courseManagementDetail/${courseId}`} state={{summary : summary}}>
                <img className="rounded-t-lg mx-auto w-full h-[150px] " src={imgUrl} alt="" />
                <div className="p-5">
                    <h5 className="mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 min-h-[50px]">{shortenedSummary}</p>
                </div>
            </Link>
        </div>
    );
}

export default TeacherCourse;