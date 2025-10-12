import React from 'react';
import { Search } from 'lucide-react';

const Search = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <Search className="search-icon" />
      <input 
        type="text" 
        placeholder="Search Menu" 
        className="search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Search;