import { hot } from "react-hot-loader/root";
import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";

import { Subheader } from "../layout";
import Suggestions from "./suggestions";
import Selections from "./selections";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Input = styled("input")`
  background: transparent;
  border: 2px solid ${props => props.theme.colors.white};
  display: flex;
  width: 100%;
  box-sizing: border-box;

  font-size: ${props => props.theme.type.sizes.small};

  color: ${props => props.theme.colors.white};
  outline-width: 0;
  border-width: 0 0 2px 0;
  padding: ${props => `calc(${props.theme.spacing.normal} / 2)`}
    ${props => props.theme.spacing.small}
    ${props => `calc(${props.theme.spacing.normal} / 2)`} 0;
`;

const Search = ({
  broadcastChange = () => {},
  dataset,
  children,
  placeholder,
  title
}) => {
  const searchRef = useRef(null);
  const [, setQuery] = useState("");

  const onChange = () => {
    setQuery(searchRef.current.value);
    if (broadcastChange) broadcastChange(searchRef.current.value);
  };

  return (
    <Wrapper>
      <Subheader>{title}</Subheader>
      <form>
        <Input placeholder={placeholder} ref={searchRef} onChange={onChange} />
      </form>
      {children}
    </Wrapper>
  );
};

// A search component that features multi-item selection
export const MultiItemSearch = ({
  colorScheme = null,
  dataset,
  onChange = () => {},
  onHover = () => {},
  placeholder,
  title
}) => {
  const [focusedSelection, setFocusedSelection] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [selections, setSelections] = useState([]);

  // we use this flag so as not to invoke the callback immediately
  // through the effect
  const isInitialMount = useRef(true);

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
    setSelections([...new Set([...selections, e])]);
  };

  const onSelectionMouseOver = e => {
    setFocusedSelection(e.target.dataset.value);
  };

  const onSelectionMouseOut = e => {
    setFocusedSelection(null);
  };

  const onSelectionClick = e => {
    const s = [...selections];
    s.splice(selections.indexOf(e), 1);
    setSelections(s);
  };

  useEffect(() => {
    if (focusedSelection) {
      // onChange([focusedSelection]);
      onHover([focusedSelection]);
    } else {
      // console.log("changing");

      // no callback on first useState
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        onChange(selections);
      }
    }
  }, [selections, focusedSelection, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Search
      broadcastChange={onSearchInputChange}
      dataset={dataset}
      placeholder={placeholder}
      title={title}
    >
      {suggestions && search !== "" && (
        // <DarkenBounds>
        <Suggestions
          values={suggestions}
          selected={selections}
          onClick={onSuggestionClick}
        />
        // </DarkenBounds>
      )}
      {selections.length > 0 && (
        <Selections
          colorScheme={colorScheme}
          focused={focusedSelection}
          onClick={onSelectionClick}
          onMouseOver={onSelectionMouseOver}
          onMouseOut={onSelectionMouseOut}
          values={selections}
        />
      )}
    </Search>
  );
};

export default hot(Search);
