import { ChangeEvent, FormEvent, useState } from "react";
import Slider from "rc-slider";
import '../../assets/rcSlider/index.css'
import { postComment } from "../../services/api";
import { Bounce, toast } from "react-toastify";

interface CommentMakeModalProps {
    show: boolean,
    onClose: () => void,
    courseId : number,
}

const CommentMakeModal = ({ show, onClose, courseId }: CommentMakeModalProps) => {

    const [newComment, setNewComment] = useState({
        content: "",
        rating: 3,
    });

    const handleNewCommentContnet = (e: ChangeEvent<HTMLInputElement>) => {
        setNewComment({...newComment, content : e.target.value})
    }

    const handleNewCommentRating = (value: number | number[]) => {
        if (Array.isArray(value)) {
            // 만약 value가 배열이라면 첫 번째 값을 사용
            setNewComment({ ...newComment, rating: value[0] });
        } else {
            // value가 단일 숫자일 때
            setNewComment({ ...newComment, rating: value });
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const JsonData: Record<string, unknown> = {
                content: newComment.content,
                rating: newComment.rating,
            }

            await postComment(courseId, JsonData);

            window.location.href = `/courseDetail/${courseId}`;
            onClose();
            
        } catch (error) {
            toast.error("리뷰 작성에 실패했습니다.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
        }
    }

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div id="default-modal" className="relative bg-gray-100 p-4 w-full max-w-md max-h-full">
                <div className="flex items-center justify-between p-3 dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        리뷰 작성
                    </h3>
                    <button
                        type="button"
                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 
                                    hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto 
                                    inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="authentication-modal"
                        onClick={onClose}
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
                </div>

                <form className="p-4 md:p-5 space-y-4 text-center">
                    <div className="flex justify-center align-center">
                        <label htmlFor="content" className="block mr-3 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            내용을 입력하세요.
                        </label>
                        <input
                            type="text"
                            name="content"
                            id="content"
                            value={newComment.content}
                            onChange={handleNewCommentContnet}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 
                                    dark:placeholder-gray-400 dark:text-white"
                            placeholder="content"
                            required />
                    </div>

                    <div className="flex justify-center align-center">
                        <label htmlFor="star" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            별점
                        </label>
                        <Slider
                            min={0}
                            max={5}
                            step={1}
                            value={newComment.rating}
                            onChange={handleNewCommentRating}
                            marks={{
                                0: '0',
                                1: '1',
                                2: '2',
                                3: '3',
                                4: '4',
                                5: '5',
                            }}
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        리뷰 작성!
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CommentMakeModal;