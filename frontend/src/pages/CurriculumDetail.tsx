import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CurriculumInfo } from "../types/CurriculumInfo";
import { useUserStore } from "../store/store";

const CurriculumDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { nickName } = useUserStore();

  const { courseId } = useParams<{ courseId: string }>();
  const [curriData] = useState<CurriculumInfo>(location.state.data);

  const flag: string = location.state.flag;

  const searchParams = new URLSearchParams(location.search);
  const curriculum_id = Number(searchParams.get("curriculum_id"));

  const handleMakeLive = () => {
    navigate(`/course/live/${courseId}`, {
      state: { memberId: nickName, flag: true, curriId: curriculum_id },
    });
  };

  const handleEnterLive = () => {
    navigate(`/course/live/${courseId}`, {
      state: {
        memberId: nickName,
        flag: false,
        curriId: curriculum_id,
      },
    });
  };

  // 페이지 접근시, 스크롤 맨위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      id="content"
      role="main"
      className="w-[70%] max-w-3xl h-[calc(100vh-155px)] relative mx-auto p-6"
    >
      <div className="mt-7 bg-white  rounded-xl shadow-lg absolute border-2 top-[20%] border-indigo-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-3xl font-bold text-gray-800 ">
              {curriData.indexNo}. {curriData.description}
            </h1>
            <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <b>Circle-Up</b>은 별도의 소프트웨어를 설치하지 않아도, 웹페이지를 통해 간편하게
              라이브 강의에 접속하실 수 있습니다.
              <br />
              강의에 참여하시기 전, 브라우저의 카메라와 마이크 권한을 허용해 주셔야 원활한 수업
              참여가 가능합니다. <br />
              설정이 완료되면, 아래 버튼을 클릭하여 강의실로 입장해 주세요. <br />
              편리한 접속 방법과 함께, 어디서든지 쉽게 라이브 강의에 참여할 수 있도록 준비되어
              있습니다!
            </p>
          </div>

          <div className="mt-5">
            <div className="grid gap-y-4">
              {/* 버튼 */}
              {flag === "instructorDetail" && (
                <button
                  type="button"
                  onClick={handleMakeLive}
                  className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-indigo-400 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
                >
                  실시간 강의 열기
                </button>
              )}
              {flag === "userDetail" && (
                <button
                  type="button"
                  onClick={handleEnterLive}
                  className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-indigo-400 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800"
                >
                  실시간 강의 참여
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetail;
