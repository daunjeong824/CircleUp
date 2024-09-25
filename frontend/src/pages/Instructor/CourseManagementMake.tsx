import { useState } from "react";
import { CourseDetailInfo } from "../../types/CourseDetailInfo";
import { tagMapping } from "../../services/tagMapping";
import { PostNewCourse } from "../../services/api";
import CourseManagementBoard from "../../components/CourseDetail/CourseManagementBoard";

const CourseManagementMake = () => {
  const [newSummary, setNewSummary] = useState<string>("Inital Data");
  const [newCourse, setNewCourse] = useState<CourseDetailInfo>({
    id: 0,
    courseName: "",
    imgUrl: "",
    imgData: null,
    instructorName: "",
    description: "",
    price: 0,
    tags: [],
    curriculums: [],
    view: 0,
    rating: 3,
  });

  const updateNewCourse = (getCourse: CourseDetailInfo) => {
    setNewCourse({ ...getCourse });
  };

  const updateNewSummary = (getSummary: string) => {
    setNewSummary(getSummary);
  };

  const fetchPostNewCourse = async (data: FormData) => {
    try {
      const response = await PostNewCourse(data);
      console.log("Response : ", response.data);

      window.location.href = "/courseManagement";
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const AddNewCourse = () => {
    const formData = new FormData();

    for (let i = 0; i < newCourse.imgData!.length; i++)
      formData.append("img", newCourse.imgData![i]);

    formData.append("name", newCourse.courseName);
    formData.append("description", newCourse.description);

    const numToTag: number[] = tagMapping(newCourse.tags);

    formData.append("tags", JSON.stringify(numToTag));

    formData.append("summary", newSummary);

    formData.append("price", newCourse.price.toString());
    formData.append("rating", newCourse.rating.toString());

    fetchPostNewCourse(formData);
  };

  return (
    <div>
      <div className="flex flex-row">
        <CourseManagementBoard
          flag={"instructorMake"}
          data={newCourse}
          summary={newSummary}
          onNewMyCourse={updateNewCourse}
          onNewSummary={updateNewSummary}
        />
      </div>
      <div className="flex flex-row">
        <div className="basis-3/4 flex justify-end mr-2">
          <button
            type="button"
            className="
                        text-white bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:ring-blue-300 
                        font-medium 
                        rounded-lg 
                        text-sm 
                        px-5 py-2.5 me-4 mb-2 
                        dark:bg-blue-600 dark:hover:bg-blue-700 
                        focus:outline-none dark:focus:ring-blue-800
                        "
            onClick={AddNewCourse}
          >
            강의 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementMake;
