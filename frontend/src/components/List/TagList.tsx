import Tag from "../Card/Tag"

interface TagListProps {
    names: string[]
}

const TagList = ({ names } : TagListProps) => {

    return (
        <div className="
            w-full mb-2
            flex flex-row flex-wrap"> 
            <p className="text-gray-500 text-xl font-bold mr-2">#</p>
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                names.map((n, idx) => (
                    <Tag key={idx} name={n} />
                ))
            }</div>
    )
}

export default TagList;