import { useEffect, useState } from "react";
import CourseVideo from "../Card/CourseVideo";
import { getCurriculumVideoUrls } from "../../services/api";

interface CourseDetailRightBoardProps {
    courseId: number,
}

interface CourseDataUrlsProps {
    docUrl: string,
    id: number,
    indexNo: number,
    recUrl: string,
}

const CourseDetailRightBoard = ({ courseId }: CourseDetailRightBoardProps) => {

    const [dataUrls, setDataUrls] = useState<CourseDataUrlsProps[]>([]);

    // <todo> - Fetch, 이전 강의 동영상 Lists 얻어오기
    const fetchCurriculumVideoUrl = async () => {
        try {
            const response = await getCurriculumVideoUrls(courseId);
            setDataUrls(response.data)
        }
        catch (error) {
            setDataUrls([]);
        }
    }

    // 만약 courseId가 내가 수강 중인 강의가 아니면 no render!
    useEffect(() => {
        fetchCurriculumVideoUrl();
    }, [courseId]);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[33%] mt-5 h-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            주차
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                강의 자료
                                {/* <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/></svg></a> */}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                라이브 영상
                                {/* <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/></svg></a> */}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataUrls.map((data, idx) => (
                            <CourseVideo key={idx} docUrl={data.docUrl} videoUrl={data.recUrl} count={data.indexNo} />
                        ))

                    }
                </tbody>
            </table>
        </div>

    )
}

export default CourseDetailRightBoard;