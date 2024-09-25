import { useEffect, useState } from "react";
import { useUserStore } from "../../store/store";
import { CommentInfo } from "../../types/CommentInfo";
import { getCommentList } from "../../services/api";
import CommentCard from "../Card/CommentCard";
import CommentMakeModal from "../Modal/CommentMakeModal";

interface CommentListProps {
  courseId: number;
  isModify: string;
}

const CommentList = ({ courseId, isModify }: CommentListProps) => {
  const { nickName, myCourseId } = useUserStore();
  const [isMyCourse, setIsMyCourse] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const commentsPerPage = 9;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentList(courseId);
        const fetchedComments = response.data;

        setComments(fetchedComments);
        setTotalPages(Math.ceil(fetchedComments.length / commentsPerPage));
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    const getIsMyCourse = () => {
      if (myCourseId.includes(courseId)) setIsMyCourse(true);
    };

    fetchComments();
    getIsMyCourse();
  }, [courseId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostComment = () => {
    console.log(isMyCourse);
    if (isMyCourse && isModify === "userDetail") {
      if (comments.find((comment) => comment.memberName === nickName))
        alert("이미 댓글을 작성했습니다! ");
      else toggleModal();
    }
    else
      alert("수강 신청 후 다시 시도해 주세요.")
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const updateComment = (deletedCommentId: number) => {
    const newComment = comments.filter((comment) => comment.id !== deletedCommentId);
    setComments(newComment);
  };

  const renderComments = () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const selectedComments = comments.slice(startIndex, startIndex + commentsPerPage);

    return (
      <div className="grid grid-cols-3">
        {selectedComments.map((comment) => (
          <CommentCard data={comment} updateFunc={updateComment} />
        ))}
      </div>
    );
  };

  return (
    <div className="comment-list">
      <CommentMakeModal show={showModal} onClose={toggleModal} courseId={courseId} />
      {renderComments()}

      {isModify === "userDetail" && (
        <button
          type="button"
          className=" float-right
                px-3 py-2 text-xs m-2 font-medium text-center text-white bg-blue-700 rounded-lg
                hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handlePostComment}
        >
          + 후기 남기기
        </button>
      )}

      <nav aria-label="Page navigation example">
        <ul className="ml-5 inline-flex -space-x-px text-sm m-2">
          <li>
            <button
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight 
                        text-gray-800 bg-white border border-e-0 border-gray-800 rounded-s-lg
                        hover:bg-gray-100 hover:text-gray-700 "
            >
              이전
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li>
              <button
                type="button"
                className="flex items-center justify-center px-3 h-8 leading-tight 
                                text-gray-800 bg-white border border-gray-800 hover:bg-gray-100 
                                hover:text-gray-700 "
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className="flex items-center justify-center px-3 h-8 leading-tight 
                        text-gray-800 bg-white border border-gray-800 rounded-e-lg hover:bg-gray-100
                        hover:text-gray-700 "
            >
              다음
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CommentList;
