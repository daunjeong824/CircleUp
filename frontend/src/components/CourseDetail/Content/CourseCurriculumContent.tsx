import { useEffect, useState } from "react";
import { getCurriculums } from "../../../services/api";
import CurriculumList from "../../List/CurriculumList";
import { CurriculumInfo } from "../../../types/CurriculumInfo";
import CurriculumMakeModal from "../../Modal/CurriculumMakeModal";

interface CourseCurriculumContent {
  isModify: string;
  courseId: number;
  summary: string;
}

const CourseCurriculumContent = ({ isModify, courseId, summary }: CourseCurriculumContent) => {
  const [curriculums, setCurriculums] = useState<CurriculumInfo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleGetCurriculums = async () => {
    const response = await getCurriculums(courseId);
    setCurriculums(response.data);
  };

    useEffect(() => {
        handleGetCurriculums();
    }, [courseId])
    
    return (
        <div>
            <CurriculumMakeModal show={showModal} onClose={toggleModal} courseId={courseId} />
            <div>
                <CurriculumList data={curriculums} isModfy={isModify} courseId={courseId} summary={summary} />
            </div>
            {isModify === "instructorModify" &&
                <button type="button"
                    className="
                    text-white bg-blue-700 hover:bg-blue-800 
                    focus:ring-4 focus:ring-blue-300 
                    font-medium rounded-lg
                    text-sm px-4 py-2.5 mx-10 mb-5
                    focus:outline-none dark:focus:ring-blue-800
                    "
          onClick={toggleModal}
        >
          커리큘럼 생성
        </button>
      }
      {/* 기타 데이터 나타내기 */}
    </div>
  );
};

export default CourseCurriculumContent;
