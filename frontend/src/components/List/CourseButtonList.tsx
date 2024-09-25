import CourseDetailButton from "../Card/CourseDetailButton";


interface CourseBtnProps {
    buttonName: string,
    color: 'green' | 'blue' | 'red';
    url : string
}

interface ListProps {
    data : CourseBtnProps[]
}

const CourseButtonList = ({ data }: ListProps) => {


    return (
        <div className="
            bg-white border border-gray-200 rounded-lg shadow
            w-[500px]
            p-6
            flex flex-row
        ">
            {data.map((btnD: CourseBtnProps, idx : number) => (
                <CourseDetailButton
                    key={idx}
                    buttonName={btnD.buttonName}
                    color={btnD.color}
                    url={btnD.url}
                />
            ))}
        </div>
    );
}

export default CourseButtonList;