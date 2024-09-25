import { Link } from "react-router-dom";
import { CourseInfo } from "./../../types/CourseInfo";
// props
interface CourseProps {
  data: CourseInfo;
  bar: boolean;
}

const Course = ({ data, bar }: CourseProps) => {
  const fullStars = Array(data.ratingNum).fill(
    <svg
      className="w-4 h-4 text-yellow-300"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );

  const emptyStars = Array(5 - data.ratingNum).fill(
    <svg
      className="w-4 h-4 text-gray-200 dark:text-gray-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );

  const maxSummaryLength = 50;
  const shortenedSummary =
    data.summary.length > maxSummaryLength
      ? `${data.summary.slice(0, maxSummaryLength)}...`
      : data.summary;

  return (
    <div className="bg-white dark:bg-gray-800 mx-auto items-center dark:border-gray-700 w-[220px]">
      <Link to={`/courseDetail/${data.id}`}>
        <img
          className="w-[100%] h-[170px] rounded-lg shadow "
          src={data.imgUrl}
          alt="product image"
        />
        <div className="px-5 pt-5">
          <h5 className="text-lg min-h-[50px] title tracking-tight text-gray-900 dark:text-white">
            {data.name}
          </h5>
          <h5 className="text-sm min-h-[60px] tracking-tight text-gray-900 dark:text-white">
            {shortenedSummary}
          </h5>
          {bar ? (
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full mt-2"
                style={{ width: `${data.progress * 100}%` }}
              >
                {" "}
                {(data.progress * 100).toFixed(0)}%
              </div>
            </div>
          ) : (
            <div className="flex items-center mt-2.5 mb-5">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {fullStars}
                {emptyStars}
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                {data.ratingStr}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Course;
