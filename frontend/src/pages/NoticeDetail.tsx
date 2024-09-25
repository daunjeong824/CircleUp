import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { NoticeInfo } from "../types/NoticeInfo";
import announcemen_img from "../assets/images/announcemen.png";

const NoticeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { courseId } = useParams<{ courseId: string }>();
  const [noticeData] = useState<NoticeInfo>(location.state.data);

  const isModify: string = location.state.flag;

  // Todo : Modify == instrcutor 인 경우 modify 버튼 구현
  const handleModify = () => {
    navigate(`/courseNoticeModify/${courseId}`, {
      state: {
        title: noticeData.title,
        content: noticeData.content,
        id: noticeData.id,
        summary: location.state.summary,
      },
    });
  };

  return (
    <div className="basis-3/4 w-[100%] h-full bg-white border border-gray-200 rounded-lg my-5 mx-3 dark:bg-gray-800 dark:border-gray-700 ">
      <div className="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-2xl">
          <div className="flex items-center mb-6 translate-x-[-50px]">
            <img src={announcemen_img} className="w-20 h-20" />
            <span className="font-semibold text-gray-800 dark:text-neutral-200">공지사항 </span>
          </div>

          <div className="space-y-5 md:space-y-8">
            <h2 className="text-2xl font-bold md:text-3xl dark:text-white">{noticeData.title}</h2>
            <p className="text-lg text-gray-800 dark:text-neutral-200"> {noticeData.content}</p>

            <div className="text-right">
              <div className="hover:cursor-default m-1 inline-block gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 ">
                <b>작성날짜 </b> {new Date(noticeData.createdAt).toLocaleDateString()}
              </div>
              <div className="hover:cursor-default m-1 inline-block items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 ">
                <b>마지막 수정 </b> {new Date(noticeData.updatedAt).toLocaleDateString()}
              </div>
              <div className="button-area">
                {isModify === "instructorDetail" && (
                  <button
                    className="block text-white bg-blue-700 hover:bg-blue-800 
                            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                            text-sm px-5 py-2.5 text-center float-right"
                    type="button"
                    onClick={handleModify}
                  >
                    수정하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5"></div>
    </div>
  );
};

export default NoticeDetail;
