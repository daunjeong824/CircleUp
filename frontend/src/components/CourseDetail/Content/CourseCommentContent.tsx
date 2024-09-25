import CommentList from "../../List/CommentList";

interface CourseCommentContentProps {
    isModify: string,
    courseId: number,
}

const CourseCommentContent = ({isModify, courseId} : CourseCommentContentProps) => {    
    return (
        <div>
            <CommentList isModify={isModify} courseId={courseId} />
        </div>
    )
}

export default CourseCommentContent;