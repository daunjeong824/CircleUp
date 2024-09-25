import { FaDownload } from "react-icons/fa";
import xCircle from "../../assets/svgs/xCircle.svg"
import { ReactSVG } from "react-svg";

interface CourseVideoProps {
    docUrl: string,
    videoUrl: string,
    count: number,
}

const CourseVideo = ({ docUrl, videoUrl, count }: CourseVideoProps) => {

    const handleMouseEnter = (event: React.MouseEvent<SVGElement>) => {
        event.currentTarget.style.color = "#3b82f6"; // 파란색으로 변경
        event.currentTarget.style.cursor = "pointer"; // 커서를 포인터로 변경
    }
    const handleMouseLeave = (event: React.MouseEvent<SVGElement>) => {
        event.currentTarget.style.color = ""; // 원래 색상으로 복귀
        event.currentTarget.style.cursor = "default"; // 커서를 기본값으로 복귀
    }

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {count}주차
            </th>
            <td className="px-8 py-4">
                {docUrl ?
                    <a href={docUrl} download={docUrl.split('/').pop() || 'docs.pdf'}>
                        <FaDownload
                            onMouseEnter={handleMouseEnter} // 마우스가 아이콘 위로 올라올 때
                            onMouseLeave={handleMouseLeave} // 마우스가 아이콘에서 벗어날 때
                            role="button" // 스크린 리더에게 버튼 역할 알림
                        />
                    </a>
                    :
                    <ReactSVG src={xCircle} />

                }
            </td>
            <td className="px-9 py-4">
                {videoUrl ?
                    <a href={videoUrl} download={videoUrl.split('/').pop() || 'video.mp4'}>
                        <FaDownload
                            onMouseEnter={handleMouseEnter} // 마우스가 아이콘 위로 올라올 때
                            onMouseLeave={handleMouseLeave} // 마우스가 아이콘에서 벗어날 때
                            role="button" // 스크린 리더에게 버튼 역할 알림
                        />
                    </a>
                    :
                    <ReactSVG src={xCircle} />
                }
            </td>
        </tr>
    )
}

export default CourseVideo;