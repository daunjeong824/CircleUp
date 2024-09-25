import { useNavigate } from "react-router-dom";
import { CourseDetailInfoBySearch } from '../../types/CourseDetailInfoBySearch';
import { FaUser, FaWonSign, FaEye  } from "react-icons/fa";

interface SearchCourseProps {
    data: CourseDetailInfoBySearch;
}

const SearchCourse = ({ data } : SearchCourseProps ) => {
    const formattedPrice = data.price === 0 ? "무료" : data.price.toLocaleString();
    const navigate = useNavigate();

    function navigateToCourseDetail() {
        navigate(`/courseDetail/${data.id}`);
    }

    const maxSummaryLength = 50;
  const shortenedSummary =
    data.summary.length > maxSummaryLength
      ? `${data.summary.slice(0, maxSummaryLength)}...`
      : data.summary;
    
    return (
        <div className="max-w-full min-h-[330px] rounded-lg max-w-sm w-[250px] bg-white rounded-lg border mx-[10px] cursor-pointer"
            onClick={navigateToCourseDetail}>
            
            <img className="rounded-t-lg mx-auto w-full h-[150px] " src={data.imgUrl} alt="" />
        
            <div className="px-5 py-3">
                <h5 className="text-base title tracking-tight mb-[2px] max-h-[50px] text-gray-800 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">{data.name}</h5>
                <div className="w-full flex my-2"> 
                    {data.tags.map((tagName, idx) => (
                        <span className="bg-indigo-100 text-indigo-800 text-sm me-2 px-2.5 rounded dark:bg-indigo-900 dark:text-indigo-300" key={idx}>{tagName}</span>
                    ))}
                </div>
                <h3 className="text-sm tracking-tight my-[0px] min-h-[50px] text-gray-800 dark:text-white">{shortenedSummary}</h3>
                <div className="text-gray-500 text-sm flex items-center">
                    <FaUser style={{color: 'gray'}} /><p className="ml-2">{data.registeredCnt}</p>
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                    <FaWonSign style={{color: 'gray'}} /><p className="ml-2">{formattedPrice}</p>
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                    <FaEye style={{color: 'gray'}} /><p className="ml-2">{data.view}</p>
                </div>
            </div>
        </div>
    );
}

export default SearchCourse;