// import
import { useState } from 'react';

// props

// components
const Search = () => {
    
    // states
    const [keywordInput, setKeywordInput] = useState<string>("");
    
    // functions
    const onKeyWordValChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setKeywordInput(e.target.value);
    }

    function handleConsole() {
        console.log(keywordInput);
    }

    return (
        // <form onSubmit={ }>
            
        // </form>
        <div>
            <input
                required={true}
                className=""
                placeholder="Test your Keyword"
                onChange={onKeyWordValChange}
            />

            <button
                className=""
                onClick={handleConsole}
            >
                Console
            </button>
        </div>
    );
};

export default Search;