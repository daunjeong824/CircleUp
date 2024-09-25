import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CurriculumInfo } from "../../types/CurriculumInfo";

const CurriculumManagementDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    
    const { courseId } = useParams <{courseId : string}>();
    const [curriData] = useState<CurriculumInfo>(location.state.data);

    const searchParams = new URLSearchParams(location.search);
    const curriculum_id = Number(searchParams.get('curriculum_id'));

    const handleModfiy = () => {
            navigate(`/curriculumManagementModify/${courseId}?curriculum_id=${curriculum_id}`,
                {state : {originalCurriculum : curriData}}
            )
    }

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {curriData.curriculumName}
                </h5>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {curriData.description}
                </p>
                <button type="button" onClick={handleModfiy}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Modfiy!
                </button>
            </div>
        </div>
    );
};

export default CurriculumManagementDetail;