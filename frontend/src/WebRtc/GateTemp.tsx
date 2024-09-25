import { Link } from "react-router-dom";
import { useState } from "react";

const GateTemp = () => {
  const [memberId, setMemberId] = useState("");
  const [courseId, setCourseId] = useState("");

  return (
    <div className="block m-5 mt-12">
      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="member_id"
            id="member_id"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
          <label
            htmlFor="member_id"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            member_id
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="course_id"
            id="course_id"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
          <label
            htmlFor="course_id"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            course_id
          </label>
        </div>

        <Link to={`/course/live/${courseId}`} state={{ memberId: memberId }}>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 "
          >
            Go To Live
          </button>
        </Link>
      </form>
    </div>
  );
};

export default GateTemp;
