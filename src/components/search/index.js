import { hot } from "react-hot-loader/root";
import React, { useState, useRef } from "react";
import styled from "@emotion/styled";

import Suggestions from "./Suggestions";
import Selections from "./Selections";

const Wrapper = styled("div")`
  display: flex;
  background-color: ${props => props.theme.colors.black};
  width: 100%;
`;

const Input = styled("input")`
  background-color: ${props => props.theme.colors.black};
  border: 2px solid ${props => props.theme.colors.white};

  color: ${props => props.theme.colors.white};
  outline-width: 0;
  border-width: 2px 0;
  padding: ${props => `calc(${props.theme.spacing.normal} / 2)`}
    ${props => props.theme.spacing.small}
    ${props => `calc(${props.theme.spacing.normal} / 2)`} 0;
`;

const Search = ({
  broadcastChange = () => {},
  placeholder,
  dataset,
  children
}) => {
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");

  const onChange = () => {
    setQuery(searchRef.current.value);
    if (broadcastChange) broadcastChange(searchRef.current.value);
  };

  return (
    <Wrapper>
      <form>
        <Input placeholder={placeholder} ref={searchRef} onChange={onChange} />
        {children}
      </form>
    </Wrapper>
  );
};

// A search component that features multi-item selection
const MultiItemSearch = ({ placeholder, dataset }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [selections, setSelections] = useState([]);
  const [search, setSearch] = useState("");

  const onSearchInputChange = e => {
    // filter dataset
    setSearch(e);
    if (e === "") {
      setSuggestions(null);
    } else {
      setSuggestions(
        dataset
          .filter(v => v.toLowerCase().includes(e.toLowerCase()))
          .filter(v => v !== " ")
      );
    }
  };

  const onSuggestionClick = e => {
    console.log([...new Set([...selections, e])]);
    setSelections([...new Set([...selections, e])]);
  };

  const onSelectionClick = e => {
    console.log(e);
    const s = [...selections];
    s.splice(selections.indexOf(e), 1);
    console.log(s);
    setSelections(s);
  };

  return (
    <Search
      broadcastChange={onSearchInputChange}
      dataset={dataset}
      placeholder={placeholder}
    >
      {selections && (
        <Selections values={selections} onClick={onSelectionClick} />
      )}
      {suggestions && search !== "" && (
        <Suggestions
          values={suggestions}
          selected={selections}
          onClick={onSuggestionClick}
        />
      )}
    </Search>
  );
};

export default hot(MultiItemSearch);
