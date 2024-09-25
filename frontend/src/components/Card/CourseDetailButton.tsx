import { useNavigate } from "react-router";

interface CourseDetailButtonProps {
    buttonName: string,
    color: 'green' | 'blue' | 'red';
    url : string
}

const buttonConfig = {
    'green' : {
        bgColor: 'bg-green-500',
        hover: "hover:bg-green-800 focus:ring-green-300",
        hoverDark: "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    },
    'blue' : {
        bgColor: 'bg-blue-500',
        hover: "hover:bg-blue-800 focus:ring-blue-300",
        hoverDark: "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
    'red' : {
        bgColor: 'bg-red-500',
        hover: "hover:bg-red-800 focus:ring-red-300",
        hoverDark: "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
      },
}


const CourseDetailButton = ({ buttonName, color, url }: CourseDetailButtonProps) => {

    const navigate = useNavigate();
    
    const handleClick = () => {
        // <ToDo> : 구매 / 공유 / 추천에 따라 추가적으로 데이터 전달하는 경우 위해, 분기 설정
        navigate(url);
    }

    if (!color || !buttonName || !url) {
        return <div>Loading...</div>
    }

        return (
            <button
                className={`
                focus:outline-none text-white 
                    ${buttonConfig[color].bgColor}
                    ${buttonConfig[color].hover}
                    ${buttonConfig[color].hoverDark}

                focus:ring-4 font-medium 
                rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
                `}
                onClick={handleClick}
            >
                {buttonName}
            </button>
        );
}

export default CourseDetailButton;
