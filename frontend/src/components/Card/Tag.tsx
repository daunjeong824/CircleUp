interface TagProps {
  name: string;
  onClick?: (name: string) => void;
}

const Tag = ({ name, onClick }: TagProps) => {
  const role = onClick ? "button" : undefined;

  return (
    <div>
      <span
        className="
            bg-blue-100 text-blue-800 text-sm
            font-medium me-2 px-2.5 py-0.5 my-0.5 rounded inline-block
             dark:bg-blue-900 dark:text-blue-300"
        role={role}
        onClick={() => {
          onClick?.(name);
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default Tag;
