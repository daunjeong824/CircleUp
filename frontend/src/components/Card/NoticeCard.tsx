import { useNavigate } from "react-router-dom";
import { NoticeInfo } from "../../types/NoticeInfo";

interface NoticeCardProps {
  data: NoticeInfo;
  courseId: number;
  isModify: string;
  idx: number;
  summary: string;
}

const NoticeCard = ({ data, courseId, isModify, idx, summary }: NoticeCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/NoticeDetail/${courseId}`, {
      state: { data: data, flag: isModify, summary: summary },
    });
  };

  return (
    <tr
      className="border-b-gray-400 border-b hover:bg-gray-50 hover:cursor-pointer"
      onClick={handleClick}
    >
      <th className="p-3">{idx}</th>
      <td width={"70%"} className="text-left pl-2 font-bold text-gray-900 tracking-tight ">
        {data.title}
      </td>
      <td width={"20%"}>{new Date(data.createdAt).toLocaleDateString()}</td>
    </tr>
  );
};

export default NoticeCard;
