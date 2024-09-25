import { Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import CourseDetail from "../pages/CourseDetail";
import CourseManagementDetail from "../pages/Instructor/CourseManagementDetail";
import CourseManagementModify from "../pages/Instructor/CourseManagementModify";
import WebRTCCourse from "../pages/WebRTCCourse";
import VideoRoomComponent from "../WebRtc/VideoRoomComponent";
import GateTemp from "../WebRtc/GateTemp";
import MainLayout from "../components/MainLayout";
import Search from "../pages/Search";
import MyCourse from "../pages/Member/MyCourse";
import CourseManagement from "../pages/Instructor/CourseManagement";
import CourseManagementMake from "../pages/Instructor/CourseManagementMake";
import CurriculumDetail from "../pages/CurriculumDetail";
import CurriculumManagementDetail from "../pages/Instructor/CurriculumManagementDetail";
import CurriculumManagementModify from "../pages/Instructor/CurriculumManagementModify";
import NoticeDetail from "../pages/NoticeDetail";
import NoticeMake from "../pages/Instructor/NoticeMake";
import NoticeModify from "../pages/Instructor/NoticeModify";

const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/courseDetail/:courseId" element={<CourseDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/CourseDetail" element={<CourseDetail />} />
        <Route path="/myCourse" element={<MyCourse />} />
        <Route path="/courseManagement" element={<CourseManagement />} />
        <Route path="/courseManagementMake" element={<CourseManagementMake />} />
        <Route path="/courseManagementModify/:courseId" element={<CourseManagementModify />} />
        <Route path="/courseManagementDetail/:courseId" element={<CourseManagementDetail />} />
        <Route path="/courseNoticeMake/:courseId" element={<NoticeMake />} />
        <Route path="/courseNoticeModify/:courseId" element={<NoticeModify />} />

        <Route path="/curriculumDetail/:courseId" element={<CurriculumDetail />} />
        <Route path="/NoticeDetail/:courseId" element={< NoticeDetail />} />

        <Route
          path="/curriculumManagementDetail/:courseId"
          element={<CurriculumManagementDetail />}
        />
        <Route
          path="/curriculumManagementModify/:courseId"
          element={<CurriculumManagementModify />}
        />

      </Route>
      <Route path="/course/live" element={<VideoRoomComponent />} />
      <Route path="/course/live/:course_id" element={<WebRTCCourse />} />
      <Route path="/course/live/gate" element={<GateTemp />} />
    </Routes>
  );
};

export default Router;
