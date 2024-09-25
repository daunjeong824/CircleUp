import { Link } from "react-router-dom";
import { CurriculumInfo } from "../../types/CurriculumInfo";
import videoCamera from "../../assets/svgs/videoCamera.svg";
import { ReactSVG } from "react-svg";

// <ToDo> - 커리큘럼은 다음과 같은 속성을 가진다.
// { id, 커리큘럼 네임, 설명, 이미지경로 }
interface CurriculumProps {
  data: CurriculumInfo;
  courseId: number;
  isModfy: string;
  summary: string;
}

const Curriculum = ({ data, courseId, isModfy, summary }: CurriculumProps) => {
  return (
    <Link
      to={
        isModfy === "instructorModify"
          ? ({
              pathname: `/curriculumManagementDetail/${courseId}`,
              search: `?curriculum_id=${data.id}`,
            } as unknown as string)
          : ({
              pathname: `/curriculumDetail/${courseId}`,
              search: `?curriculum_id=${data.id}`,
            } as unknown as string)
      }
      state={{ data: data, flag: isModfy, summary: summary }}
    >
      <div className="flex flex-row p-1  border-b hover:bg-gray-50 ">
        <li className="mx-2 py-2">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 w-full">
              <p className=" text-gray-900  font-semibold">
                {data.indexNo}주차
                {data.isCurrent ? (
                  <ReactSVG
                    className="inline-block translate-x-1.5 translate-y-1.5		"
                    src={videoCamera}
                  />
                ) : (
                  <></>
                )}
              </p>
              <p className="text-lg font-medium text-gray-500 truncate ">{data.description}</p>
            </div>
          </div>
        </li>
      </div>
    </Link>
  );
};

export default Curriculum;
