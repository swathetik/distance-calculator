// src/components/AutocompleteInput.js
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Input = styled.input`
  margin: 5px;
  padding: 10px;
  width: 300px;
`;

const Suggestions = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  width: 300px;
  z-index: 1;
`;

const Suggestion = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const AutocompleteInput = ({ placeholder, onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setQuery(value);
    if (value.length > 2) {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`,
        {
          params: {
            access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
            autocomplete: true,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setSuggestions([]);
    onSelect(place);
  };

  return (
    <div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <Suggestions>
          {suggestions.map((place) => (
            <Suggestion key={place.id} onClick={() => handleSelect(place)}>
              {place.place_name}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </div>
  );
};

export default AutocompleteInput;
