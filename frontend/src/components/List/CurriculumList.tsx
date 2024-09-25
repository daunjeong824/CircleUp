import { CurriculumInfo } from "../../types/CurriculumInfo";
import Curriculum from "../Card/Curriculum";
import { useEffect, useState } from "react";

interface CurriculumListprops {
  data: CurriculumInfo[];
  courseId: number;
  isModfy: string;
  summary: string;
}

const CurriculumList = ({ data, courseId, isModfy, summary }: CurriculumListprops) => {
  const [curriculums, setCurriculums] = useState<CurriculumInfo[]>([]);

  useEffect(() => {
    setCurriculums(data);
  }, [data]);

  if (curriculums.length === 0)
    return <div className="p-4"><h3>현재 커리큘럼이 준비 중에 있습니다.</h3></div>;

  return (
    <div>
      <div className="w-auto mx-4 p-1 rounded-lg mx-auto my-5 ">
        <ul className=" divide-y divide-gray-200 ">
          {curriculums.map((curri, idx) => (
            <Curriculum key={idx} data={curri} isModfy={isModfy} courseId={courseId} summary={summary} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurriculumList;
