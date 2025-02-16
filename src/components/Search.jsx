import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

export default function Search(props) {
  const [queryParams, setQueryParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const initialInput = queryParams.get('term') ?? 'law';

  const [input, setInput] = useState(initialInput);
  const [isValid, setIsValid] = useState(true);

  const [searchMode, setSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [isInputFocused, setIsInputFocused] = useState(false); // Track input focus
  const [error, setError] = useState(null); // Add error state

  const invalidClass = !isValid ? 'border-[1px] border-red' : '';

  useEffect(() => {
    setInput(initialInput);
    props.fetchData(initialInput);
  }, [initialInput]); // Add props to the dependency array

  function handleChange(event) {
    setInput(event.target.value);
    setSearchMode(false); // Hide results when input changes
    setError(null); // Clear any previous errors
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (input.length < 1) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setQueryParams({ term: input });
    console.log(input)
    navigate(`/?term=${input}`); // Update URL using navigate
    props.fetchData(input); // Fetch data based on the new term
  }

  function handleSubmit2(result) {
    setSearchMode(false)
    setIsValid(true);
    setQueryParams({ term: result });
    console.log(result)
    navigate(`/?term=${result}`); // Update URL using navigate
    props.fetchData(result); // Fetch data based on the new term
  }

  async function handleSearch() {
    if (input.length === 0) {
      setSearchMode(false);
      return;
    }

    setLoading(true); // Set loading to true
    setError(null); // Clear previous errors

    try {
      const response = await axios.get(`https://tcid.onrender.com/terms?q=${input}`); // Correct query parameter
      setSearchResult(response.data); // Access response data
      setSearchMode(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching search results. Please try again later.'); // Set error message
    } finally {
      setLoading(false); // Set loading to false, regardless of success/failure
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={`w-full bg-gray-3 dark:bg-black-2 leading-[1.25rem] rounded-2xl py-[0.875rem] pl-6 pr-14 tablet:py-5 tablet:pl-6 tablet:pr-18 text-default tablet:text-20 font-bold bg-search bg-no-repeat bg-right-4 placeholder:text-gray outline-none focus:outline-purple ${invalidClass}`}
        value={input}
        onChange={handleChange}
        onKeyUp={handleSearch} 
        onFocus={() => setIsInputFocused(true)} 
        // onBlur={() => {
        //   setTimeout(() => setIsInputFocused(false), 100); 
        // }}
        placeholder="Search for any word…"
      />
      {loading && <p>Loading...</p>} {/* Display loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {/* Search Results */}
      {searchMode && isInputFocused && (
      <div className="relative w-full"> {/* Make the container relative */}
        {searchResult.length > 0 ? (
          <div className="absolute top-0 left-0 w-full z-10 overflow-y-auto max-h-48 bg-white dark:bg-black-2 border border-gray-300 rounded-md shadow-lg"> {/* Style and position the results */}
            <ul className="w-full p-2 flex flex-col divide-y">
              {searchResult.map((result) => (
                <li
                  key={result}
                  className="p-2 font-lato font-light text-sm hover:bg-gray-200 cursor-pointer hover:opacity-50"
                  onClick={() => {
                    handleSubmit2(result)
                  }}
                >
                  {result}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && <p className="mt-2 text-gray-500">No results found.</p> // Message when no results
        )}
        {loading && <p className="mt-2">Loading...</p>} {/* Loading indicator */}
        {error && <p className="mt-2 text-red-500">{error}</p>} {/* Error message */}
      </div>
    )}
      {searchMode && searchResult.length === 0 && !loading && (
        <p>No results found.</p>
      )}
      {!isValid && <div className="text-red mt-2">Input can’t be empty…</div>}
    </form>
  );
}