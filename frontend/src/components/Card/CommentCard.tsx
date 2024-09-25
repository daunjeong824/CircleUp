import { ReactSVG } from "react-svg";
import { CommentInfo } from "../../types/CommentInfo";
import star from "./../../assets/svgs/star.svg";
import { useUserStore } from "../../store/store";
import { deleteComment } from "../../services/api";

interface CommentProps {
  data: CommentInfo;
  updateFunc: (commentId: number) => void;
}

const CommentCard = ({ data, updateFunc }: CommentProps) => {
  const { nickName } = useUserStore();

  const handleDelete = () => {
    try {
      const fetchDeleteComment = async () => {
        const response = await deleteComment(data.courseId, data.id);
        return response.data;
      };

      alert("삭제 완료!");
      updateFunc(data.id);
      fetchDeleteComment();
    } catch (error) {
      console.error("오류로 인해 삭제 할 수 없습니다!");
    }
  };

  return (
    <div className="m-4 py-5 px-4 bg-white border border-gray-100 shadow-2xl aspect-auto rounded-2xl shadow-gray-600/10">
      <div className="flex gap-4 justify-between	 items-start mb-4">
        <div>
          <h6 className="text-lg text-gray-700 font-bold"> {data.memberName}</h6>
          <p className="text-sm text-gray-500">{new Date(data.createAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-row mt-1">
          {Array.from({ length: data.rating }, (_, i) => (
            <ReactSVG key={i} src={star} />
          ))}

          {Array.from({ length: 5 - data.rating }, (_, i) => (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.04897 2.92702C9.34897 2.00602 10.652 2.00602 10.951 2.92702L12.021 6.21902C12.0863 6.41951 12.2134 6.5942 12.384 6.71812C12.5547 6.84205 12.7601 6.90886 12.971 6.90902H16.433C17.402 6.90902 17.804 8.14902 17.021 8.71902L14.221 10.753C14.05 10.877 13.9227 11.052 13.8573 11.2529C13.7919 11.4537 13.7918 11.6701 13.857 11.871L14.927 15.163C15.227 16.084 14.172 16.851 13.387 16.281L10.587 14.247C10.4162 14.123 10.2105 14.0562 9.99947 14.0562C9.78842 14.0562 9.58277 14.123 9.41197 14.247L6.61197 16.281C5.82797 16.851 4.77397 16.084 5.07297 15.163L6.14297 11.871C6.20815 11.6701 6.20803 11.4537 6.14264 11.2529C6.07725 11.052 5.94994 10.877 5.77897 10.753L2.97997 8.72002C2.19697 8.15002 2.59997 6.91002 3.56797 6.91002H7.02897C7.24002 6.91007 7.44568 6.84336 7.6165 6.71942C7.78732 6.59548 7.91455 6.42067 7.97997 6.22002L9.04997 2.92802L9.04897 2.92702Z"
                fill="#e5e7eb"
              />
            </svg>
          ))}
          {nickName === data.memberName ? (
            <button
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 
                        hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto 
                        inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
              onClick={handleDelete}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <p>{data.content}</p>
    </div>
  );
};

export default CommentCard;
