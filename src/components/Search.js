import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/posts/?search=${query}`); // Adjust endpoint for searching
            setResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search posts..." 
                    required 
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
