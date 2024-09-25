import { useState } from "react";
import Tag from "../Card/Tag";

interface TagsModalProps {
  show: boolean;
  onClose: () => void;

  tags: string[];
  updateFunc: (newTags: string[]) => void;
}

const selectTags: string[] = [
  "요리",
  "베이킹",
  "운동",
  "요가",
  "기술",
  "예술",
  "드로잉",
  "음악",
  "피아노",
  "프로그래밍",
  "포토그래피",
  "인테리어",
  "공예",
];

const MakeTagModal = ({ show, onClose, tags, updateFunc }: TagsModalProps) => {
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [newTag, setNewTag] = useState<string>("");

  const selectNewTag = (data: string) => {
    const getName = data;
    setNewTag(getName);
  };

  const resetNewTags = () => {
    setNewTags([]);
    setNewTag("");
    alert("초기화 되었습니다.");
  };
  const updateTags = () => {
    const getNewTags = [...newTags, newTag];
    setNewTags([...new Set(getNewTags)]);
    alert("성공적으로 추가되었습니다.");
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div id="default-modal" className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-4 md:p-5">
            <div id="Array Rendering" className="w-full flex pb-2 flex-row flex-wrap ">
              {selectTags.map((sTag, idx) => (
                <Tag key={idx} onClick={selectNewTag} name={sTag} />
              ))}
            </div>
            <div>선택된 태그 : {newTag}</div>
          </div>

          <div className="pb-4 flex flex-row justify-center">
            <button
              type="button"
              className="
                            block text-white bg-blue-700 hover:bg-blue-800
                            focus:ring-4 focus:outline-none focus:ring-blue-300 
                            font-small rounded-lg px-2.5 py-1 text-xs text-center
                            mx-1
                        "
              onClick={updateTags}
            >
              {" "}
              추가{" "}
            </button>
            <button
              type="button"
              className="
                            block text-blue-700 border-blue-700 border
                            font-small rounded-lg px-2.5 py-1 text-xs text-center
                            mx-1
                        "
              onClick={() => {
                updateFunc(newTags);
                onClose();
              }}
            >
              닫기
            </button>
          </div>
          <div className="h-8 mr-1">
            <button
              type="button"
              className="
                            block text-white bg-blue-700 hover:bg-blue-800
                            focus:ring-4 focus:outline-none focus:ring-blue-300 
                            font-small rounded-lg px-2.5 py-1 text-xs text-center
                            mx-1 float-right
                        "
              onClick={resetNewTags}
            >
              선호강의 태그 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeTagModal;
